import express from 'express';
import cors from 'cors';
import axios from 'axios';
import * as cheerio from 'cheerio';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SOURCES_PATH = path.join(__dirname, 'src', 'data', 'sources.json');
const MASTER_DATA = JSON.parse(fs.readFileSync(SOURCES_PATH, 'utf-8'));

// Global Discovery State (In-Memory Only)
const discoveryResults = new Map();

// Initialize results with idle state
MASTER_DATA.sources.forEach(source => {
  discoveryResults.set(source.id, {
    ...source,
    status: 'idle',
    discoveredEndpoints: [],
    chosenEndpoint: null,
    detectedContentType: null,
    lastCheckedAt: null,
    analysisDuration: 0,
    totalCandidatesFound: 0,
    discoveryOrigin: null,
    logs: []
  });
});

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3000;

// --- Utility Functions ---

function addLog(sourceId, message, type = 'info', stage = 'general') {
  const result = discoveryResults.get(sourceId);
  if (result) {
    result.logs.push({
      timestamp: new Date().toISOString(),
      message,
      type,
      stage
    });
  }
}

function normalizeUrl(url, baseUrl) {
  try {
    return new URL(url, baseUrl).href;
  } catch (e) {
    return null;
  }
}

// --- Discovery Engine Helper Functions ---

function fetchHtml(url, options) {
  return axios.get(url, {
    headers: options.headers || {},
    timeout: options.timeout || 10000,
    maxRedirects: options.maxRedirects || 5
  });
}

function extractCandidatesFromHtml(html, baseUrl) {
  const candidates = new Set();
  const $ = cheerio.load(html);
  
  // Extract from tags
  $('a, iframe, script, img, source, video').each((i, el) => {
    const src = $(el).attr('src') || $(el).attr('href') || $(el).attr('data-src');
    if (src) {
      const absolute = normalizeUrl(src, baseUrl);
      if (absolute) candidates.add(absolute);
    }
  });

  // Extract from regex (common for URLs in strings/JSON/Scripts inside HTML)
  const regex = /https?:\/\/[^"'\s>{}[\]]+/g;
  const matches = html.match(regex) || [];
  matches.forEach(m => candidates.add(m));

  return Array.from(candidates);
}

async function extractCandidatesFromScripts(scriptUrls, sourceId) {
  const candidates = new Set();
  for (const sUrl of scriptUrls) {
    try {
      addLog(sourceId, `Downloading & scanning script: ${sUrl.substring(0, 60)}...`, 'info', 'discovery');
      const response = await axios.get(sUrl, { timeout: 5000 });
      const jsContent = response.data;
      const matches = jsContent.match(/https?:\/\/[^"'\s>{}[\]]+/g) || [];
      matches.forEach(m => candidates.add(m));
    } catch (err) {
      addLog(sourceId, `Failed to load script: ${sUrl}`, 'warning', 'discovery');
    }
  }
  return Array.from(candidates);
}

function filterCandidateUrls(urls, keywords) {
  return urls.filter(url => {
    const u = url.toLowerCase();
    // Exclude common junk
    if (u.includes('google-analytics') || u.includes('facebook.com') || u.includes('googletagmanager')) return false;
    return keywords.some(k => u.includes(k.toLowerCase()));
  });
}

function chooseBestEndpoint(endpoints) {
  const priority = MASTER_DATA.globalConfig.contentTypePriority;
  for (const type of priority) {
    const found = endpoints.find(e => e.contentType.startsWith(type));
    if (found) return found;
  }
  return endpoints[0] || null;
}

async function probeCandidate(url, sourceId) {
  const config = MASTER_DATA.globalConfig;
  try {
    addLog(sourceId, `Probing candidate: ${url.substring(0, 100)}...`, 'info', 'probe');
    const response = await axios.head(url, {
      headers: config.defaultHeaders,
      timeout: 5000,
      maxRedirects: config.maxRedirects,
      validateStatus: () => true
    });

    if (response.status >= 200 && response.status < 400) {
      const contentType = String(response.headers['content-type'] || 'unknown');
      addLog(sourceId, `SUCCESS: ${url} -> ${contentType}`, 'success', 'probe');
      return { url, contentType: contentType.split(';')[0].trim() };
    }
    
    // Some servers block HEAD, try small GET
    const getResponse = await axios.get(url, {
      headers: config.defaultHeaders,
      timeout: 5000,
      maxRedirects: config.maxRedirects,
      responseType: 'stream',
      validateStatus: () => true
    });

    if (getResponse.status >= 200 && getResponse.status < 400) {
      const contentType = String(getResponse.headers['content-type'] || 'unknown');
      addLog(sourceId, `SUCCESS (via GET): ${url} -> ${contentType}`, 'success', 'probe');
      return { url, contentType: contentType.split(';')[0].trim() };
    }

    addLog(sourceId, `FAIL: ${url} returned ${response.status}`, 'warning', 'probe');
    return null;
  } catch (error) {
    addLog(sourceId, `ERROR probing ${url}: ${error.message}`, 'error', 'probe');
    return null;
  }
}

async function discoverSource(sourceId) {
  const result = discoveryResults.get(sourceId);
  if (!result) return;

  const startTime = Date.now();
  result.status = 'processing';
  result.lastCheckedAt = new Date().toISOString();
  result.logs = []; 
  result.totalCandidatesFound = 0;
  const config = MASTER_DATA.globalConfig;
  const keywords = config.candidateUrlKeywords;

  addLog(sourceId, `INITIATING PIPELINE: ${result.name} (${result.scope})`, 'info', 'discovery');

  const allCandidates = new Set();
  const entrypoints = result.entrypoints || [];

  for (const ep of entrypoints) {
    try {
      addLog(sourceId, `STEP 01: Fetching Entrypoint [${ep.label}] -> ${ep.url}`, 'info', 'discovery');
      const response = await fetchHtml(ep.url, { headers: config.defaultHeaders });
      const html = response.data;

      addLog(sourceId, `STEP 02: Extracting candidates from HTML source...`, 'info', 'discovery');
      const htmlCandidates = extractCandidatesFromHtml(html, ep.url);
      htmlCandidates.forEach(c => allCandidates.add(c));

      if (result.captureProfile?.mode === 'html-plus-js-discovery') {
        addLog(sourceId, `STEP 02-B: Mode [html-plus-js-discovery] active. Locating internal scripts.`, 'info', 'discovery');
        const $ = cheerio.load(html);
        const scriptUrls = [];
        const host = new URL(ep.url).hostname;
        
        $('script[src]').each((i, el) => {
          const src = $(el).attr('src');
          const abs = normalizeUrl(src, ep.url);
          if (abs && abs.includes(host)) scriptUrls.push(abs);
        });

        const jsCandidates = await extractCandidatesFromScripts(scriptUrls, sourceId);
        jsCandidates.forEach(c => allCandidates.add(c));
      }
    } catch (error) {
      addLog(sourceId, `STEP 01 FAIL: Error fetching entrypoint: ${error.message}`, 'error', 'discovery');
    }
  }

  result.totalCandidatesFound = allCandidates.size;
  addLog(sourceId, `STEP 03: Filtering ${allCandidates.size} raw URLs against keywords...`, 'info', 'discovery');
  const filtered = filterCandidateUrls(Array.from(allCandidates), keywords);
  addLog(sourceId, `Targeting ${filtered.length} candidates for validation.`, 'info', 'discovery');

  const endpoints = [];
  for (const cand of filtered.slice(0, 25)) {
    const probed = await probeCandidate(cand, sourceId);
    if (probed) endpoints.push(probed);
  }

  result.discoveredEndpoints = endpoints;
  const best = chooseBestEndpoint(endpoints);
  result.analysisDuration = Date.now() - startTime;

  if (best && !best.contentType.includes('html')) {
    result.chosenEndpoint = best.url;
    result.detectedContentType = best.contentType;
    result.discoveryOrigin = 'regex-detection';
    result.status = 'success';
    addLog(sourceId, `FINAL STATUS [SUCCESS]: Found high-priority endpoint: ${best.contentType}`, 'success', 'status');
  } else if (best) {
    result.chosenEndpoint = best.url;
    result.detectedContentType = best.contentType;
    result.discoveryOrigin = 'html-structure';
    result.status = 'partial';
    addLog(sourceId, `FINAL STATUS [PARTIAL]: Only HTML/Low priority endpoints found.`, 'warning', 'status');
  } else {
    result.status = 'fallback';
    result.chosenEndpoint = result.captureProfile?.fallback?.url || result.officialPage || entrypoints[0]?.url;
    result.detectedContentType = 'text/html';
    result.discoveryOrigin = 'official-link';
    addLog(sourceId, `FINAL STATUS [FALLBACK]: No endpoints responded. Using landing page.`, 'warning', 'fallback');
  }

  return result;
}

// --- API Endpoints ---

app.get('/api/sources', (req, res) => {
  res.json(Array.from(discoveryResults.values()));
});

app.post('/api/discover', async (req, res) => {
  const { id } = req.body;
  if (!id) return res.status(400).json({ error: 'Source ID is required' });
  
  const result = await discoverSource(id);
  res.json(result);
});

app.post('/api/discover-all', async (req, res) => {
  const ids = Array.from(discoveryResults.keys());
  
  // Process in sequence to be polite to target servers and avoid timeout issues in proxy
  const results = [];
  for (const id of ids) {
    results.push(await discoverSource(id));
  }
  
  res.json(results);
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
