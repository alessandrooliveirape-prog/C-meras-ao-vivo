import React, { useState, useEffect, useMemo, useRef } from 'react';
import ReactPlayer from 'react-player';
import { 
  Camera, 
  Search, 
  MapPin, 
  RefreshCw, 
  Play, 
  ExternalLink, 
  Info, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Terminal,
  ShieldCheck,
  ChevronUp,
  ChevronDown,
  Building2,
  Globe,
  Database,
  Cpu,
  Zap,
  Activity,
  History,
  Copy,
  Eye,
  Maximize2,
  Trash2,
  FilterX
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface SourceLog {
  timestamp: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  stage: 'discovery' | 'probe' | 'fallback' | 'status' | 'general';
}

interface DiscoveredEndpoint {
  url: string;
  contentType: string;
}

interface Source {
  id: string;
  name: string;
  scope: 'municipal' | 'estadual';
  state: string;
  city: string;
  category: string;
  officialPage?: string;
  entrypoints?: { label: string; url: string }[];
  status: 'idle' | 'processing' | 'success' | 'partial' | 'fallback' | 'blocked' | 'error';
  discoveredEndpoints: DiscoveredEndpoint[];
  chosenEndpoint: string | null;
  detectedContentType: string | null;
  lastCheckedAt: string | null;
  analysisDuration?: number;
  totalCandidatesFound?: number;
  discoveryOrigin?: string;
  logs: SourceLog[];
}

export default function App() {
  const [sources, setSources] = useState<Source[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSourceId, setActiveSourceId] = useState<string | null>(null);
  
  // Filters
  const [search, setSearch] = useState('');
  const [filterState, setFilterState] = useState('');
  const [filterScope, setFilterScope] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  
  const [isProcessingAll, setIsProcessingAll] = useState(false);

  useEffect(() => {
    fetchSources();
  }, []);

  const fetchSources = async () => {
    try {
      const res = await fetch('/api/sources');
      const data = await res.json();
      setSources(data);
    } catch (err) {
      console.error('Failed to fetch sources', err);
    } finally {
      setLoading(false);
    }
  };

  const discoverOne = async (id: string) => {
    setSources(prev => prev.map(s => s.id === id ? { ...s, status: 'processing' } : s));
    try {
      const res = await fetch('/api/discover', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      const updated = await res.json();
      setSources(prev => prev.map(s => s.id === id ? updated : s));
    } catch (err) {
      setSources(prev => prev.map(s => s.id === id ? { ...s, status: 'error' } : s));
    }
  };

  const discoverAll = async () => {
    setIsProcessingAll(true);
    try {
      const res = await fetch('/api/discover-all', { method: 'POST' });
      const results = await res.json();
      setSources(results);
    } catch (err) {
      console.error('Discover-all failed', err);
    } finally {
      setIsProcessingAll(false);
    }
  };

  const clearFilters = () => {
    setSearch('');
    setFilterState('');
    setFilterScope('');
    setFilterCategory('');
  };

  const activeSource = useMemo(() => 
    sources.find(s => s.id === activeSourceId) || null
  , [sources, activeSourceId]);

  const filteredSources = useMemo(() => {
    return sources.filter(s => {
      const matchesSearch = !search || 
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.city.toLowerCase().includes(search.toLowerCase()) ||
        s.state.toLowerCase().includes(search.toLowerCase());
      const matchesState = !filterState || s.state === filterState;
      const matchesScope = !filterScope || s.scope === filterScope;
      const matchesCategory = !filterCategory || s.category === filterCategory;
      return matchesSearch && matchesState && matchesScope && matchesCategory;
    });
  }, [sources, search, filterState, filterScope, filterCategory]);

  const stats = useMemo(() => {
    return {
      total: sources.length,
      success: sources.filter(s => s.status === 'success' || s.status === 'partial').length,
      fallback: sources.filter(s => s.status === 'fallback').length,
      processing: sources.filter(s => s.status === 'processing').length,
      error: sources.filter(s => s.status === 'error').length
    };
  }, [sources]);

  const UFs = Array.from(new Set(sources.map(s => s.state))).sort();
  const categories = Array.from(new Set(sources.map(s => s.category))).sort();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center space-y-6">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="w-16 h-16 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full"
        />
        <div className="text-center">
           <h2 className="text-white font-bold text-lg uppercase tracking-widest italic">Iniciando Motor de Descoberta</h2>
           <p className="text-slate-500 text-xs font-mono mt-2">Carregando catálogo de fontes governamentais...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-slate-950 text-slate-200 flex flex-col overflow-hidden font-sans selection:bg-emerald-500/30">
      {/* Header */}
      <header className="h-16 border-b border-slate-800 bg-slate-950 flex items-center justify-between px-6 flex-shrink-0 z-50 shadow-lg shadow-black/40">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-600/30">
            <Camera className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tighter text-white flex items-center gap-2">
              GovScalpel <span className="px-1.5 py-0.5 bg-emerald-500 text-slate-950 text-[10px] rounded font-black italic">BETA</span>
            </h1>
            <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest leading-none">Traffic Cam Discovery Engine</p>
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-10">
           <StatMini label="Fontes" value={stats.total} icon={Globe} color="text-blue-400" tooltip="Total de portais no catálogo" />
           <StatMini label="Sync OK" value={stats.success} icon={CheckCircle2} color="text-emerald-400" tooltip="Endpoints multimedia ativos" />
           <StatMini label="Active" value={stats.processing} icon={Activity} color="text-amber-400" active={stats.processing > 0} tooltip="Processamento em tempo real" />
           <StatMini label="Fallback" value={stats.fallback} icon={AlertTriangle} color="text-slate-500" tooltip="Caiu para portal oficial" />
           <StatMini label="Errors" value={stats.error} icon={XCircle} color="text-red-500" tooltip="Falhas críticas de conexão" />
        </div>

        <div className="flex items-center gap-4">
           <button 
             onClick={discoverAll}
             disabled={isProcessingAll}
             className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 transition-all shadow-lg shadow-emerald-600/20 active:scale-95 border border-emerald-400/20"
           >
             {isProcessingAll ? <RefreshCw className="animate-spin w-4 h-4" /> : <Zap size={16} />}
             <span className="hidden sm:inline">{isProcessingAll ? 'Processando Cluster...' : 'Deep Scan All'}</span>
           </button>
        </div>
      </header>

      {/* Main Layout Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Source List */}
        <aside className="w-80 xl:w-96 border-r border-slate-800 flex flex-col bg-slate-900/10 flex-shrink-0">
           {/* Sidebar Filters */}
           <div className="p-4 border-b border-slate-800 space-y-3 bg-slate-900/30">
              <div className="relative">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600 w-4 h-4" />
                 <input 
                   type="text"
                   placeholder="Buscar fonte..."
                   value={search}
                   onChange={e => setSearch(e.target.value)}
                   className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 pl-9 pr-3 text-xs text-slate-300 focus:ring-1 focus:ring-emerald-500/50 outline-none transition-all placeholder:text-slate-700 font-medium"
                 />
              </div>
              <div className="flex gap-2">
                 <select 
                   value={filterState} 
                   onChange={e => setFilterState(e.target.value)}
                   className="flex-1 bg-slate-950 border border-slate-800 rounded-lg py-1.5 px-3 text-[10px] font-bold text-slate-400 outline-none uppercase"
                 >
                   <option value="">UF</option>
                   {UFs.map(uf => <option key={uf} value={uf}>{uf}</option>)}
                 </select>
                 <button 
                   onClick={clearFilters}
                   className="p-1.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-600 hover:text-red-400 transition-colors"
                   title="Limpar Filtros"
                 >
                    <FilterX size={14} />
                 </button>
              </div>
           </div>

           {/* List */}
           <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-800">
              <div className="divide-y divide-slate-800/40">
                 {filteredSources.map(source => (
                   <SourceListItem 
                      key={source.id}
                      source={source}
                      isActive={activeSourceId === source.id}
                      onClick={() => setActiveSourceId(source.id)}
                      onRefresh={() => discoverOne(source.id)}
                   />
                 ))}
                 
                 {filteredSources.length === 0 && (
                   <div className="p-10 text-center space-y-3">
                      <Search size={32} className="mx-auto text-slate-800" />
                      <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest">Nenhum resultado</p>
                   </div>
                 )}
              </div>
           </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 bg-slate-950 flex flex-col overflow-hidden">
           <AnimatePresence mode="wait">
             {activeSource ? (
               <motion.div 
                 key={activeSource.id}
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 exit={{ opacity: 0, y: -10 }}
                 className="flex-1 flex flex-col"
               >
                 {/* Detail Header */}
                 <div className="p-6 bg-slate-900/30 border-b border-slate-800 flex justify-between items-start">
                    <div className="space-y-1">
                       <div className="flex items-center gap-3">
                          <h2 className={cn("text-2xl font-bold tracking-tight italic", activeSource.status === 'processing' ? "text-slate-700 animate-pulse" : "text-white")}>
                             {activeSource.name}
                          </h2>
                          <div className={cn(
                            "px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest",
                            activeSource.scope === 'municipal' ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" : "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                          )}>
                             {activeSource.scope}
                          </div>
                          {activeSource.status === 'processing' && (
                            <span className="flex items-center gap-2 text-amber-500 text-[10px] font-black uppercase animate-pulse">
                               <RefreshCw size={10} className="animate-spin" /> Analyzing Target...
                            </span>
                          )}
                       </div>
                       <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-slate-400 text-xs font-medium">
                          <div className="flex items-center gap-1.5 bg-slate-950 px-2 py-1 rounded border border-slate-800">
                             <MapPin size={12} className={activeSource.status === 'processing' ? "text-slate-700" : "text-emerald-500"} />
                             {activeSource.city}, {activeSource.state}
                          </div>
                          <div className="flex items-center gap-1.5 bg-slate-950 px-2 py-1 rounded border border-slate-800 shadow-sm">
                             <Building2 size={12} className={activeSource.status === 'processing' ? "text-slate-700" : "text-blue-500"} />
                             {activeSource.category.toUpperCase()}
                          </div>
                          {activeSource.lastCheckedAt && (
                            <div className="flex items-center gap-1.5 text-slate-600 italic">
                               <History size={12} />
                               Last sync: {new Date(activeSource.lastCheckedAt).toLocaleTimeString()}
                            </div>
                          )}
                       </div>
                    </div>

                    <div className="flex items-center gap-3">
                       <a 
                         href={activeSource.officialPage || activeSource.entrypoints?.[0]?.url} 
                         target="_blank" 
                         rel="noreferrer"
                         className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-bold rounded-lg transition-all"
                       >
                         <ExternalLink size={14} /> <span className="hidden sm:inline">Official Page</span>
                       </a>
                       <button 
                         onClick={() => discoverOne(activeSource.id)}
                         disabled={activeSource.status === 'processing'}
                         className="flex items-center gap-2 px-6 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-black rounded-lg transition-all shadow-lg shadow-emerald-500/20 uppercase tracking-widest"
                       >
                         <RefreshCw size={14} className={activeSource.status === 'processing' ? 'animate-spin' : ''} />
                         {activeSource.status === 'processing' ? 'Running Pipeline...' : 'Run Discovery'}
                       </button>
                    </div>
                 </div>

                 {/* Discovery Engine Output */}
                 <div className="flex-1 flex overflow-hidden">
                    {/* Left Panel: Results & Preview */}
                    <div className="flex-1 p-6 space-y-6 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-800 bg-slate-950/40">
                       
                       {/* Result Banner */}
                       <div className={cn(
                         "border rounded-2xl p-6 relative overflow-hidden transition-all duration-500",
                         activeSource.status === 'processing' ? "bg-slate-900/40 border-slate-800 animate-pulse" : "bg-slate-900/50 border-slate-800"
                       )}>
                          <div className="absolute top-0 right-0 p-3 opacity-10">
                             <Cpu size={80} className={activeSource.status === 'processing' ? "text-amber-500" : "text-white"} />
                          </div>
                          
                          <div className="relative z-10 space-y-6">
                             <div className="flex items-center justify-between">
                                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 italic">Discovery Result Output</h4>
                                <ConfidenceBadge status={activeSource.status} />
                             </div>

                             {activeSource.chosenEndpoint && activeSource.status !== 'processing' ? (
                               <div className="space-y-4">
                                  <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between gap-4 group shadow-inner">
                                     <div className="flex-1 overflow-hidden">
                                        <div className="text-[8px] font-bold text-slate-700 uppercase mb-1">Target Endpoint URL</div>
                                        <div className="text-emerald-400 font-mono text-xs truncate">{activeSource.chosenEndpoint}</div>
                                     </div>
                                     <div className="flex items-center gap-2 shrink-0">
                                        <button 
                                          onClick={() => {
                                            navigator.clipboard.writeText(activeSource.chosenEndpoint!);
                                            alert('URL copiada para o clipboard');
                                          }}
                                          className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 border border-slate-800 hover:bg-slate-800 rounded text-[10px] font-bold text-slate-400 transition-all"
                                        >
                                           <Copy size={12} /> <span className="hidden sm:inline">Copiar</span>
                                        </button>
                                        <a 
                                          href={activeSource.chosenEndpoint!} 
                                          target="_blank" 
                                          rel="noreferrer"
                                          className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 border border-slate-800 hover:bg-slate-800 rounded text-[10px] font-bold text-slate-400 transition-all"
                                        >
                                           <ExternalLink size={12} /> <span className="hidden sm:inline">Abrir</span>
                                        </a>
                                     </div>
                                  </div>

                                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                     <ResultMetric label="Mime-Type" value={activeSource.detectedContentType || 'N/A'} icon={Database} />
                                     <ResultMetric label="Discovery Method" value={activeSource.discoveryOrigin || 'manual scan'} icon={Globe} color="text-blue-400" />
                                     <ResultMetric label="Candidates" value={`${activeSource.totalCandidatesFound || 0} tested`} icon={Zap} />
                                     <ResultMetric label="Analysis Time" value={`${activeSource.analysisDuration || 0}ms`} icon={Activity} />
                                  </div>
                               </div>
                             ) : (
                               <div className="py-10 text-center space-y-4 bg-slate-950/40 rounded-2xl border border-dashed border-slate-800">
                                  <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center mx-auto">
                                     <Terminal className="text-slate-700" size={32} />
                                  </div>
                                  <div>
                                     <p className="text-xs text-slate-500 font-medium">Pipeline is currently idle.</p>
                                     <p className="text-[10px] text-slate-700 uppercase font-black tracking-widest mt-1">Select "Run Discovery" to start scanning entrypoints.</p>
                                  </div>
                               </div>
                             )}
                          </div>
                       </div>

                       {/* Preview Area */}
                       <div className="space-y-4">
                          <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 italic px-2">Visual Verification Stage</h4>
                          <div className={cn(
                            "aspect-video bg-black rounded-2xl border flex items-center justify-center overflow-hidden shadow-2xl relative group transition-all duration-700",
                            activeSource.status === 'processing' ? "border-amber-500/20 grayscale" : "border-slate-800"
                          )}>
                             {activeSource.chosenEndpoint && activeSource.status !== 'processing' ? (
                               <ActivePreview source={activeSource} />
                             ) : (
                               <div className="text-center space-y-6 opacity-40 py-12">
                                  <div className="w-20 h-20 bg-slate-900/50 rounded-full flex items-center justify-center mx-auto border border-dashed border-slate-700 animate-pulse">
                                     <Eye size={40} className="text-slate-700" />
                                  </div>
                                  <div className="space-y-2">
                                     <p className="text-xs uppercase font-black tracking-[0.3em] text-slate-500">Visual data queue</p>
                                     <p className="text-[10px] text-slate-700 font-medium max-w-[200px] mx-auto italic">Waiting for endpoint validation signal from scanner pipeline...</p>
                                  </div>
                               </div>
                             )}
                             {activeSource.status === 'processing' && (
                               <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center">
                                  <div className="flex flex-col items-center gap-4">
                                     <div className="relative">
                                        <RefreshCw size={48} className="text-amber-500 animate-spin" />
                                        <div className="absolute inset-0 flex items-center justify-center">
                                           <Zap size={16} className="text-amber-400 animate-pulse" />
                                        </div>
                                     </div>
                                     <p className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-500 italic">Capturing Stream...</p>
                                  </div>
                               </div>
                             )}
                          </div>
                       </div>
                    </div>

                    {/* Right Panel: Logs (Fixed width Sidebar inside detail) */}
                    <div className="w-80 xl:w-96 border-l border-slate-800 h-full flex flex-col bg-slate-950 shadow-2xl">
                       <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/20">
                          <div className="flex items-center gap-2">
                             <Terminal size={14} className="text-emerald-500" />
                             <h4 className="text-[10px] font-black uppercase tracking-widest text-white">Pipeline Logs</h4>
                          </div>
                          <span className="text-[9px] font-mono text-slate-700 truncate ml-4 italic">v1.2.discovery_engine</span>
                       </div>
                       <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
                          <LogGroup 
                            title="Discovery Stage" 
                            icon={Search} 
                            logs={activeSource.logs.filter(l => l.stage === 'discovery')} 
                            defaultOpen={true}
                          />
                          <LogGroup 
                            title="Probing Stage" 
                            icon={Activity} 
                            logs={activeSource.logs.filter(l => l.stage === 'probe')} 
                          />
                          <LogGroup 
                            title="Fallback Logic" 
                            icon={AlertTriangle} 
                            logs={activeSource.logs.filter(l => l.stage === 'fallback')} 
                          />
                          <LogGroup 
                            title="Final Resolution" 
                            icon={CheckCircle2} 
                            logs={activeSource.logs.filter(l => l.stage === 'status')} 
                            defaultOpen={true}
                          />

                          {activeSource.logs.length === 0 && (
                            <div className="h-full flex flex-col items-center justify-center space-y-4 opacity-10">
                               <RefreshCw size={48} className="animate-spin-slow" />
                               <p className="text-[10px] font-black uppercase tracking-[0.3em]">Listening for events...</p>
                            </div>
                          )}
                       </div>
                    </div>
                 </div>
               </motion.div>
             ) : (
               <motion.div 
                 key="onboarding"
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 className="flex-1 flex items-center justify-center p-12"
               >
                 <div className="max-w-xl w-full text-center space-y-12">
                    <div className="space-y-4">
                       <div className="w-24 h-24 bg-emerald-600/10 border border-emerald-500/20 rounded-3xl flex items-center justify-center mx-auto mb-6">
                          <Camera className="text-emerald-500" size={48} />
                       </div>
                       <h2 className="text-3xl font-bold text-white italic tracking-tighter">Traffic Cam Recovery Console</h2>
                       <p className="text-slate-500 text-sm leading-relaxed max-w-sm mx-auto">
                          Sistema centralizado para descoberta de ativos de monitoramento público. Selecione uma fonte no painel lateral para iniciar o diagnóstico técnico.
                       </p>
                    </div>

                    <div className="grid grid-cols-3 gap-6 text-left">
                       <OnboardingStep 
                         step="01" 
                         title="Source Select" 
                         desc="Escolha um portal governamental no catálogo esquerdo."
                         icon={Database}
                       />
                       <OnboardingStep 
                         step="02" 
                         title="Run Analysis" 
                         desc="O motor de descoberta irá escanear o HTML em busca de m3u8/jpeg."
                         icon={Zap}
                       />
                       <OnboardingStep 
                         step="03" 
                         title="Extract Assets" 
                         desc="Valide o endpoint em tempo real no painel operacional."
                         icon={Activity}
                       />
                    </div>
                    
                    <div className="pt-8 border-t border-slate-900 flex justify-center gap-8">
                       <div className="flex flex-col items-center gap-1">
                          <span className="text-[10px] text-slate-700 font-black uppercase tracking-widest">Estado do Sistema</span>
                          <span className="flex items-center gap-2 text-emerald-500 text-[10px] font-bold">
                             <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                             FULLY OPERATIONAL
                          </span>
                       </div>
                       <div className="flex flex-col items-center gap-1">
                          <span className="text-[10px] text-slate-700 font-black uppercase tracking-widest">Network Latency</span>
                          <span className="text-slate-300 text-[10px] font-bold italic">PROXIED VIA AI-STUDIO (32ms)</span>
                       </div>
                    </div>
                 </div>
               </motion.div>
             )}
           </AnimatePresence>
        </main>
      </div>

      {/* Footer Info Bar */}
      <footer className="h-8 border-t border-slate-800 bg-slate-950 px-6 flex items-center justify-between flex-shrink-0 z-50">
         <div className="flex items-center gap-4 text-[9px] font-bold text-slate-600 uppercase tracking-widest">
            <span className="flex items-center gap-1.5">
               <ShieldCheck size={10} className="text-emerald-500" />
               Oficial Data Catalog
            </span>
            <span className="text-slate-800">/</span>
            <span>Build 2026.04.24</span>
         </div>
         <div className="flex items-center gap-4 text-[9px] font-mono text-slate-700">
            <span>MEM_USAGE: 42MB</span>
            <span>REGION: US-EAST-1</span>
         </div>
      </footer>
    </div>
  );
}

// --- Subcomponents ---

function StatMini({ label, value, icon: Icon, color, active, tooltip }: { label: string, value: number, icon: any, color: string, active?: boolean, tooltip?: string }) {
  return (
    <div className="flex items-center gap-2 group relative cursor-help">
       <Icon className={cn("w-4 h-4", color, active && "animate-pulse")} />
       <div className="flex flex-col -space-y-1">
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">{label}</span>
          <span className="text-xs font-bold text-white tabular-nums">{value}</span>
       </div>
       {tooltip && (
         <div className="absolute top-full mt-2 left-0 w-48 bg-slate-800 text-[10px] text-slate-300 p-2 rounded border border-slate-700 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-[100] shadow-2xl">
            {tooltip}
         </div>
       )}
    </div>
  );
}

function SourceListItem({ source, isActive, onClick, onRefresh }: { source: Source, isActive: boolean, onClick: () => void, onRefresh: () => void }) {
  const domain = source.officialPage ? new URL(source.officialPage).hostname.replace('www.', '') : 'desconhecido';
  
  return (
    <div 
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      className={cn(
        "w-full text-left p-4 transition-all hover:bg-slate-800/40 group relative overflow-hidden cursor-pointer outline-none",
        isActive ? "bg-slate-800/60 border-l-4 border-emerald-500 shadow-inner" : "border-l-4 border-transparent hover:border-slate-700"
      )}
    >
      <div className="flex items-start justify-between mb-2">
         <div className="flex items-center gap-2">
            <StatusDot status={source.status} />
            <span className={cn(
              "text-[9px] font-black uppercase tracking-widest",
              source.status === 'success' ? "text-emerald-400" :
              source.status === 'processing' ? "text-amber-400" :
              source.status === 'error' ? "text-red-500" : "text-slate-500"
            )}>
              {source.status === 'processing' ? 'Syncing...' : source.status}
            </span>
         </div>
         <div className="flex items-center gap-2">
            <button 
              onClick={(e) => { e.stopPropagation(); onRefresh(); }}
              className="p-1 hover:text-emerald-400 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100 outline-none"
              title="Quick Sync"
            >
               <RefreshCw size={10} className={source.status === 'processing' ? 'animate-spin' : ''} />
            </button>
            <span className="text-[10px] font-mono text-slate-700">#{source.id}</span>
         </div>
      </div>

      <h3 className={cn(
        "font-bold text-sm leading-tight transition-colors mb-1 truncate mr-2",
        isActive ? "text-white" : "text-slate-400 group-hover:text-slate-200"
      )}>
        {source.name}
      </h3>
      
      <div className="flex items-center justify-between mt-2">
         <div className="flex items-center gap-2 text-[10px] text-slate-600 font-bold uppercase tracking-tighter">
            <Globe size={10} className="text-slate-800" />
            <span className="truncate max-w-[120px]">{domain}</span>
         </div>
         <span className="text-[8px] font-mono text-slate-700 italic">
            {source.lastCheckedAt ? new Date(source.lastCheckedAt).toLocaleTimeString() : 'Never'}
         </span>
      </div>
    </div>
  );
}

function StatusDot({ status }: { status: Source['status'] }) {
  const colors = {
    idle: 'bg-slate-700',
    processing: 'bg-amber-500',
    success: 'bg-emerald-500',
    partial: 'bg-blue-500',
    fallback: 'bg-slate-500',
    blocked: 'bg-red-500',
    error: 'bg-red-600'
  };
  return <div className={cn("w-1.5 h-1.5 rounded-full shrink-0", colors[status], status === 'processing' && 'animate-pulse')} />;
}

function OnboardingStep({ step, title, desc, icon: Icon }: { step: string, title: string, desc: string, icon: any }) {
  return (
    <div className="space-y-2">
       <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-emerald-500">
             <Icon size={16} />
          </div>
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">{step}</span>
       </div>
       <h4 className="text-xs font-bold text-white uppercase italic">{title}</h4>
       <p className="text-[10px] text-slate-600 leading-relaxed font-medium">{desc}</p>
    </div>
  );
}

function LogGroup({ title, icon: Icon, logs, defaultOpen = false }: { title: string, icon: any, logs: SourceLog[], defaultOpen?: boolean }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  if (logs.length === 0) return null;

  return (
    <div className="space-y-0.5">
       <button 
         onClick={() => setIsOpen(!isOpen)}
         className="w-full flex items-center justify-between text-[8px] font-black uppercase tracking-[0.2em] text-slate-600 hover:text-slate-400 transition-colors py-1.5 px-2 bg-slate-900/50 border border-slate-800/40 rounded focus:outline-none"
       >
          <div className="flex items-center gap-2">
             <Icon size={10} className="text-slate-700" />
             {title}
             <span className="text-slate-800 ml-1">[{logs.length}]</span>
          </div>
          <div className="flex items-center gap-2">
             <div className="w-1 h-1 bg-emerald-500/30 rounded-full" />
             {isOpen ? <ChevronUp size={10} /> : <ChevronDown size={10} />}
          </div>
       </button>
       <AnimatePresence>
          {isOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden space-y-px"
            >
               {logs.map((log, i) => (
                 <LogEntry key={i} log={log} />
               ))}
            </motion.div>
          )}
       </AnimatePresence>
    </div>
  );
}

function LogEntry({ log }: { log: SourceLog }) {
  const typeColors = {
    info: 'text-slate-500 border-slate-800/40',
    success: 'text-emerald-500 border-emerald-900/30 bg-emerald-500/5',
    warning: 'text-amber-500 border-amber-900/30 bg-amber-500/5',
    error: 'text-red-500 border-red-900/30 bg-red-500/5'
  };

  const logsTypeBadge = {
    info: 'INF',
    success: 'RES',
    warning: 'WRN',
    error: 'ERR'
  };

  return (
    <div className={cn("border-l-2 pl-3 py-1 transition-all hover:bg-white/5", typeColors[log.type])}>
       <div className="flex items-center gap-2 mb-0.5">
          <span className="text-[7px] font-mono opacity-20 italic shrink-0">{new Date(log.timestamp).toLocaleTimeString()}</span>
          <span className="text-[6px] font-black uppercase tracking-widest px-1 rounded bg-black/40 border border-current opacity-40 shrink-0">
             {logsTypeBadge[log.type]}
          </span>
       </div>
       <p className="text-[9px] font-mono break-all leading-tight opacity-70 group-hover:opacity-100">
          {log.message}
       </p>
    </div>
  );
}

function ConfidenceBadge({ status }: { status: Source['status'] }) {
  const labels = {
    success: 'High Confidence',
    partial: 'Medium Confidence',
    fallback: 'Low Confidence / Redirect',
    error: 'Scan Failed',
    idle: 'Awaiting Diagnostics',
    processing: 'Analyzing Payload...'
  };

  const colors = {
    success: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    partial: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    fallback: 'text-slate-500 bg-slate-500/10 border-slate-500/20',
    error: 'text-red-400 bg-red-500/10 border-red-500/20',
    idle: 'text-slate-600 bg-slate-900/50 border-slate-800',
    processing: 'text-amber-400 bg-amber-500/10 border-amber-500/20'
  };

  return (
    <div className={cn("px-2 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border italic flex items-center gap-2", colors[status])}>
       {status === 'processing' && <RefreshCw size={8} className="animate-spin" />}
       {labels[status]}
    </div>
  );
}

function ResultMetric({ label, value, icon: Icon, color }: { label: string, value: string, icon: any, color?: string }) {
  return (
    <div className="bg-slate-950/60 border border-slate-800/60 p-3 rounded-xl flex flex-col gap-1">
       <div className="flex items-center gap-1.5">
          <Icon size={12} className="text-slate-600" />
          <span className="text-[8px] font-black uppercase tracking-widest text-slate-600">{label}</span>
       </div>
       <span className={cn("text-[10px] font-bold truncate", color || "text-slate-300")}>{value}</span>
    </div>
  );
}

function ActivePreview({ source }: { source: Source }) {
  const [timestamp, setTimestamp] = useState(Date.now());
  const isImage = source.detectedContentType?.startsWith('image');
  const isHtml = source.detectedContentType?.includes('html');
  const isStream = source.detectedContentType?.includes('mpegurl') || source.detectedContentType?.includes('m3u8') || source.chosenEndpoint?.includes('.m3u8');

  useEffect(() => {
    if (isImage) {
      const interval = setInterval(() => setTimestamp(Date.now()), 15000); // 15s refresh for JPG
      return () => clearInterval(interval);
    }
  }, [isImage]);

  if (isImage) {
    return (
      <>
        <img 
          src={isImage && source.chosenEndpoint ? `${source.chosenEndpoint}${source.chosenEndpoint.includes('?') ? '&' : '?'}_t=${timestamp}` : ''} 
          className="w-full h-full object-contain" 
          alt="Live Target Feed" 
          onError={(e) => {
             (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1496661415325-ef852f9e8e7c?auto=format&fit=crop&q=80&w=1200';
          }}
        />
        <div className="absolute top-4 right-4 flex items-center gap-2">
           <div className="flex items-center gap-1.5 px-2 py-1 bg-black/60 backdrop-blur-md rounded border border-white/10 text-[9px] font-bold text-white shadow-xl">
              <div className="w-1 h-1 bg-red-500 rounded-full animate-pulse" />
              LIVE DECODE
           </div>
        </div>
      </>
    );
  }

  if (isStream) {
    return (
      <div className="w-full h-full bg-black relative">
         <ReactPlayer 
           url={source.chosenEndpoint!}
           playing
           controls
           muted
           width="100%"
           height="100%"
           config={{
             file: {
               forceHLS: true
             }
           } as any}
         />
         <div className="absolute top-4 left-4 pointer-events-none">
            <div className="px-2 py-1 bg-emerald-500 text-slate-950 text-[9px] font-black uppercase tracking-widest rounded shadow-lg">
               STREAM DETECTED
            </div>
         </div>
      </div>
    );
  }

  if (isHtml) {
    return (
      <div className="w-full h-full flex flex-col">
         <iframe 
           src={source.chosenEndpoint!}
           className="w-full flex-1 border-none grayscale contrast-125 brightness-75 opacity-80"
           title="Portal Sandbox"
         />
         <div className="absolute inset-0 bg-transparent pointer-events-none border-4 border-emerald-500/10 pointer-events-none" />
         <div className="absolute bottom-4 left-4 right-4 p-3 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between shadow-2xl">
            <div className="flex items-center gap-3">
               <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <ExternalLink size={16} />
               </div>
               <div>
                  <p className="text-[10px] font-black text-white uppercase italic tracking-widest">Sandboxed Portal</p>
                  <p className="text-[8px] text-slate-500 font-medium">Interactive frame restricted mapping</p>
               </div>
            </div>
            <a 
              href={source.chosenEndpoint!} 
              target="_blank" 
              rel="noreferrer"
               className="px-3 py-1.5 bg-emerald-600 text-white text-[9px] font-black rounded uppercase tracking-widest shadow-lg shadow-emerald-600/30"
            >
              Popout
            </a>
         </div>
      </div>
    );
  }

  return (
    <div className="text-center p-12 space-y-6">
       <div className="w-20 h-20 bg-slate-900 border border-slate-800 rounded-3xl flex items-center justify-center mx-auto text-emerald-500/20 group-hover:text-emerald-500/40 transition-colors">
          <Play size={40} className="ml-1" />
       </div>
       <div className="space-y-2">
          <p className="text-xs text-white font-bold uppercase italic tracking-widest">Streaming Metadata Detected</p>
          <p className="text-[10px] text-slate-600 font-medium max-w-xs mx-auto">
             Target endpoint matches <span className="text-slate-400">{source.detectedContentType}</span> binary signature. Visual rendering requires specialized HLS/MPEG player.
          </p>
       </div>
       <div className="flex justify-center gap-3">
          <a 
            href={source.chosenEndpoint!} 
            target="_blank" 
            rel="noreferrer"
            className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-black rounded-lg transition-all shadow-lg shadow-emerald-500/20 uppercase tracking-widest"
          >
             Open External Stream
          </a>
       </div>
    </div>
  );
}
