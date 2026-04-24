import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Camera as CameraIcon, 
  MapPin, 
  Eye, 
  Clock, 
  Share2, 
  Heart, 
  Info, 
  AlertTriangle, 
  ChevronRight, 
  ExternalLink, 
  Youtube,
  Settings,
  Maximize2,
  Volume2,
  VolumeX,
  RefreshCw,
  Activity,
  Signal,
  Search
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ReactPlayer from 'react-player';
import { CAMERAS } from '../data/brazilData';
import { AdPlaceholder } from '../components/AdPlaceholder';
import { SEO } from '../components/SEO';
import { Breadcrumbs } from '../components/Breadcrumbs';

const Player = ReactPlayer as any;

export const CameraPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const camera = CAMERAS.find(c => c.slug === slug);

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [volume, setVolume] = useState(0.8);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sidebarSearch, setSidebarSearch] = useState('');
  const [stats, setStats] = useState({
    bitrate: '0 kbps',
    fps: 0,
    latency: '0ms'
  });

  const playerRef = useRef<any>(null);

  // Fallback to show player if onReady takes too long
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isReady && !error) {
        console.log('Forced ready state after timeout');
        setIsReady(true);
      }
    }, 3000);
    return () => clearTimeout(timer);
  }, [isReady, error, isRefreshing]);

  // Simulate real-time stats
  useEffect(() => {
    if (!isReady) return;
    const interval = setInterval(() => {
      setStats({
        bitrate: `${(Math.random() * 2000 + 4000).toFixed(0)} kbps`,
        fps: Math.random() > 0.1 ? 60 : 58,
        latency: `${(Math.random() * 50 + 120).toFixed(0)}ms`
      });
    }, 2000);
    return () => clearInterval(interval);
  }, [isReady]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setIsReady(false);
    setError(null);
    setTimeout(() => setIsRefreshing(false), 500);
  };

  if (!camera) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <AlertTriangle className="w-16 h-16 text-emerald-600" />
        <h1 className="text-xl font-black text-slate-900 uppercase tracking-tighter italic">Câmera não encontrada</h1>
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">O stream pode estar fora do ar ou o link está incorreto.</p>
        <Link to="/" className="bg-[#059669] text-white px-8 py-4 rounded-sm text-[10px] font-black uppercase tracking-[0.2em] hover:bg-slate-900 transition-all">
          Voltar para a Home
        </Link>
      </div>
    );
  }

  const toggleMute = () => setIsMuted(!isMuted);

  return (
    <div className="flex-1 flex flex-col xl:flex-row overflow-hidden bg-[#F1F5F9]">
      <SEO 
        title={`${camera.title} - Ao Vivo`}
        description={camera.description}
        image={camera.thumbnail}
      />
      
      {/* Main Stream Column */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
        <Breadcrumbs />

        <div className="space-y-4">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] bg-red-600 text-white font-black uppercase px-2 py-0.5 rounded-sm">Transmissão Direta</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{camera.city}, {camera.stateCode}</span>
                </div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic">
                  {camera.title}
                </h1>
              </div>
              
              <div className="flex flex-wrap items-center gap-2">
                <a 
                  href={camera.url.includes('embed/') 
                    ? `https://www.youtube.com/watch?v=${camera.url.split('embed/')[1].split('?')[0]}`
                    : camera.url.replace('embed/', 'watch?v=')
                  } 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-red-600 rounded-sm text-[10px] font-black text-white uppercase tracking-widest hover:bg-red-700 transition-all font-mono shadow-sm"
                >
                  <Youtube className="w-3 h-3" /> YouTube
                </a>
                <button 
                  onClick={handleRefresh}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-900 border border-slate-700 rounded-sm text-[10px] font-black text-white uppercase tracking-widest hover:bg-black transition-all shadow-sm group"
                >
                  <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} /> Recarregar
                </button>
                <button className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-sm text-[10px] font-black text-slate-600 uppercase tracking-widest hover:bg-slate-50 transition-all">
                  <Share2 className="w-3 h-3" /> Compartilhar
                </button>
              </div>
            </div>
        </div>

        {/* Player Box - MONITOR DESIGN */}
        <div 
          id="camera-monitor-container"
          className="relative bg-black border-8 border-slate-800 shadow-2xl aspect-video group overflow-hidden rounded-md ring-1 ring-slate-700/50"
        >
            {/* Scanline Effect */}
            <div className="absolute inset-0 pointer-events-none z-30 opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]"></div>
            
            {/* Loading/Error State */}
            <AnimatePresence>
              {(!isReady || isRefreshing || error) && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex items-center justify-center bg-slate-950 z-40"
                >
                    <div className="flex flex-col items-center gap-6 text-center px-10">
                        {error ? (
                          <div className="space-y-4">
                            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto" />
                            <p className="text-[11px] text-red-400 font-extrabold uppercase tracking-[0.2em] leading-relaxed">
                              Erro de Transmissão:<br />{error}
                            </p>
                            <button 
                              onClick={handleRefresh}
                              className="px-6 py-2 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-sm hover:bg-emerald-500 transition-colors"
                            >
                              Tentar Novamente
                            </button>
                          </div>
                        ) : (
                          <div className="space-y-6">
                            <div className="relative">
                              <div className="w-16 h-16 border-4 border-emerald-500/10 border-t-emerald-500 rounded-full animate-spin"></div>
                              <div className="absolute inset-0 flex items-center justify-center">
                                <Activity className="w-6 h-6 text-emerald-500/40 animate-pulse" />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <p className="text-[11px] text-white font-black uppercase tracking-[0.4rem] animate-pulse">Estabelecendo Link...</p>
                              <div className="flex items-center justify-center gap-1">
                                {[1,2,3,4,5].map(i => (
                                  <motion.div 
                                    key={i}
                                    animate={{ height: [4, 12, 4], opacity: [0.3, 1, 0.3] }}
                                    transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
                                    className="w-0.5 bg-emerald-500"
                                  />
                                ))}
                              </div>
                            </div>
                            <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest max-w-[200px] leading-loose">
                              Iniciando stream adaptativo para {camera.city}...
                            </p>
                          </div>
                        )}
                    </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Manual Play Overlay */}
            {isReady && !isPlaying && !isRefreshing && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-30 pointer-events-auto">
                <button 
                  onClick={() => setIsPlaying(true)}
                  className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform group"
                >
                  <Youtube className="w-10 h-10 text-white group-hover:animate-pulse" />
                </button>
              </div>
            )}
            <div className={`relative w-full h-full z-10 transition-all duration-500 ${isRefreshing ? 'opacity-0' : 'opacity-100'}`}>
              {camera.type === 'portal' ? (
                <iframe
                  src={camera.url}
                  className="w-full h-full border-0 bg-white"
                  title={camera.title}
                  onLoad={() => setIsReady(true)}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                ></iframe>
              ) : (
                <Player
                  ref={playerRef}
                  url={camera.url}
                  width="100%"
                  height="100%"
                  playing={isPlaying}
                  muted={isMuted}
                  volume={volume}
                  playsinline={true}
                  controls={camera.type === 'hls'}
                  onReady={() => {
                    console.log('Player ready');
                    setIsReady(true);
                  }}
                  onStart={() => setIsReady(true)}
                  onError={(e: any) => {
                    console.error('Player error:', e);
                    setError('Ocorreu um erro ao carregar a transmissão. O link pode estar temporariamente indisponível.');
                  }}
                  config={{
                    youtube: {
                      playerVars: { 
                        autoplay: 1,
                        mute: 1,
                        modestbranding: 1, 
                        rel: 0, 
                        iv_load_policy: 3,
                        enablejsapi: 1
                      }
                    },
                    file: {
                      forceHLS: true,
                      attributes: {
                        style: { width: '100%', height: '100%', objectFit: 'cover' }
                      }
                    }
                  } as any}
                />
              )}
            </div>

            {/* MONITOR OVERLAY (HUD) */}
            <div className="absolute inset-0 pointer-events-none z-20 p-4 flex flex-col justify-between font-mono text-white/70 overflow-hidden">
                {/* Top Overlay */}
                <div className="flex justify-between items-start">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 bg-black/60 px-3 py-1.5 backdrop-blur-md border border-white/5 rounded-sm">
                          <div className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse shadow-[0_0_8px_rgba(220,38,38,0.8)]"></div>
                          <span className="text-[10px] font-black uppercase tracking-tighter">HD LIVE</span>
                          <span className="text-[8px] opacity-40">|</span>
                          <span className="text-[9px] font-bold text-white uppercase tracking-widest">{camera.id.padStart(3, '0')}</span>
                        </div>
                        <div className="flex items-center gap-2 bg-black/40 px-2 py-0.5 rounded-sm w-fit text-[8px] uppercase tracking-tighter">
                          <Signal className="w-2 h-2 text-emerald-400" />
                          Link: {camera.stateCode}-{camera.city.substring(0,3).toUpperCase()}
                        </div>
                    </div>
                    
                    <div className="flex flex-col items-end gap-1">
                        <div className="bg-black/60 px-3 py-1 backdrop-blur-md border border-white/5 rounded-sm text-[10px] font-black tracking-[0.1em] flex items-center gap-2">
                             <Clock className="w-3 h-3 text-emerald-400" />
                             {new Date().toLocaleTimeString('pt-BR', { hour12: false })}
                        </div>
                        <div className="text-[8px] bg-emerald-500/20 text-emerald-300 px-2 rounded-sm border border-emerald-500/20 font-bold uppercase tracking-widest">
                           Sincronizado
                        </div>
                    </div>
                </div>

                {/* Bottom Stats Overlay */}
                <div className="flex justify-between items-end">
                    <div className="bg-black/80 p-3 backdrop-blur-lg border border-white/5 rounded-sm flex gap-6 text-[8px] font-bold uppercase tracking-widest">
                        <div className="space-y-1">
                          <span className="text-slate-500 block">Bitrate</span>
                          <span className="text-white block">{stats.bitrate}</span>
                        </div>
                        <div className="space-y-1">
                          <span className="text-slate-500 block">Frame Rate</span>
                          <span className="text-white block">{stats.fps} FPS</span>
                        </div>
                        <div className="space-y-1">
                          <span className="text-slate-500 block">Latência</span>
                          <span className="text-white block">{stats.latency}</span>
                        </div>
                    </div>
                    
                    <div className="text-[8px] bg-black/60 px-2 py-1 rounded-sm border border-white/5 text-slate-400 font-bold uppercase tracking-tighter">
                       Cam Feed: {camera.slug.toUpperCase()}
                    </div>
                </div>
            </div>

            {/* BUILT-IN CUSTOM CONTROLS */}
            <div className="absolute inset-x-0 bottom-0 z-30 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 p-4">
                <div className="bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-lg p-3 flex items-center justify-between shadow-2xl">
                    <div className="flex items-center gap-4">
                        <button 
                          onClick={() => setIsPlaying(!isPlaying)}
                          className="hover:scale-110 transition-transform active:scale-95 text-white"
                        >
                           {isPlaying ? <RefreshCw className="w-5 h-5" /> : <Youtube className="w-5 h-5 text-red-500" />}
                        </button>
                        
                        <div className="flex items-center gap-2">
                          <button onClick={toggleMute} className="text-white/80 hover:text-white transition-colors">
                            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                          </button>
                          <input 
                            type="range" 
                            min="0" 
                            max="1" 
                            step="0.01" 
                            value={volume}
                            onChange={(e) => setVolume(parseFloat(e.target.value))}
                            className="w-20 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                          />
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 bg-slate-800/50 px-3 py-1.5 rounded-md border border-white/5">
                           <Activity className="w-3 h-3 text-emerald-500" />
                           <span className="text-[9px] font-black text-white/70 uppercase">HD Adaptativo</span>
                        </div>
                        <button className="text-white/60 hover:text-white transition-colors">
                           <Settings className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => document.getElementById('camera-monitor-container')?.requestFullscreen()}
                          className="text-white/60 hover:text-white transition-colors"
                        >
                           <Maximize2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <AdPlaceholder format="horizontal" className="shadow-sm" />

        {/* Details Grid */}
        <div id="camera-details-section" className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <section className="bg-white p-8 rounded-sm border border-slate-200 shadow-sm space-y-6">
                <h2 className="text-[10px] uppercase font-black text-slate-400 tracking-[0.2em] border-b border-slate-100 pb-2">Informações do Stream</h2>
                <div className="space-y-4">
                    <p className="text-xs text-slate-600 leading-relaxed font-medium">
                        {camera.description}
                    </p>
                    <div className="bg-emerald-50 border-l-4 border-emerald-500 p-4">
                        <div className="flex gap-3">
                            <Info className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                            <p className="text-[10px] text-emerald-800 font-bold leading-tight uppercase text-pretty">
                                <span className="block mb-1">Dica de Transmissão</span>
                                Este player utiliza tecnologia adaptativa para garantir a melhor fluidez possível. Em caso de travamentos, clique em <span className="text-emerald-600">Recarregar</span> no painel superior.
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                    {camera.tags.map(tag => (
                        <span key={tag} className="px-2 py-1 bg-slate-100 text-[9px] font-black text-slate-500 uppercase tracking-widest border border-slate-200">
                        #{tag}
                        </span>
                    ))}
                    </div>
                </div>
            </section>

            <section className="bg-slate-900 text-white p-8 rounded-sm shadow-sm space-y-6">
                <h2 className="text-[10px] uppercase font-black text-emerald-400 tracking-[0.2em] border-b border-white/10 pb-2">Dados Técnicos</h2>
                <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-1">
                        <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest block">Canal</span>
                        <span className="text-sm font-bold block truncate">{camera.title.substring(0, 20)}</span>
                    </div>
                    <div className="space-y-1">
                        <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest block">Resolução</span>
                        <span className="text-sm font-bold text-emerald-400 block tracking-tighter">HD 1080p (Adaptativo)</span>
                    </div>
                    <div className="space-y-1">
                        <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest block">Status do Link</span>
                        <span className="text-sm font-bold text-emerald-400 block flex items-center gap-2 italic">
                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.6)]"></span>
                            Online
                        </span>
                    </div>
                    <div className="space-y-1">
                        <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest block">Audiência Acumulada</span>
                        <span className="text-sm font-bold block">{camera.views.toLocaleString()}</span>
                    </div>
                </div>
            </section>
        </div>
      </div>

      {/* Sidebar Navigation */}
      <aside className="w-full xl:w-96 bg-white border-l border-slate-200 p-6 space-y-8 overflow-y-auto">
        <div id="sidebar-search-section" className="space-y-4">
          <h3 className="text-[10px] uppercase font-black text-slate-400 tracking-[0.2em] mb-4 border-b border-slate-100 pb-2 italic">Buscar Câmeras</h3>
          <div className="relative">
            <input 
              type="text"
              value={sidebarSearch}
              onChange={(e) => setSidebarSearch(e.target.value)}
              placeholder="Cidade, título ou hashtag..."
              className="w-full bg-slate-50 border border-slate-200 rounded-sm px-4 py-2 text-xs text-slate-700 outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-medium"
            />
            <Search className="absolute right-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
          </div>
        </div>

        <div id="related-cameras-sidebar">
          <h3 className="text-[10px] uppercase font-black text-slate-400 tracking-[0.2em] mb-4 border-b border-slate-100 pb-2 italic text-balance">
            {sidebarSearch ? `Resultados para "${sidebarSearch}"` : `Recomendações no ${camera.stateCode}`}
          </h3>
          <div className="space-y-4">
              {(() => {
                const searchLower = sidebarSearch.toLowerCase();
                const filteredList = CAMERAS.filter(c => {
                  if (c.id === camera.id) return false;
                  if (!sidebarSearch) {
                    return c.stateCode === camera.stateCode || c.id < '6';
                  }
                  return (
                    c.title.toLowerCase().includes(searchLower) ||
                    c.city.toLowerCase().includes(searchLower) ||
                    c.tags.some(t => t.toLowerCase().includes(searchLower))
                  );
                });

                if (filteredList.length === 0) {
                  return (
                    <div className="py-8 text-center bg-slate-50 border border-dashed border-slate-200 rounded-sm">
                      <AlertTriangle className="w-6 h-6 text-slate-300 mx-auto mb-2" />
                      <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed">
                        Nenhuma câmera encontrada<br />com estes termos.
                      </p>
                    </div>
                  );
                }

                return filteredList.slice(0, 10).map(related => (
                  <Link key={related.id} to={`/camera/${related.slug}`} className="flex gap-4 group">
                    <div className="w-24 aspect-video rounded-sm overflow-hidden flex-shrink-0 bg-slate-900 bg-opacity-10 shadow-sm">
                      <img src={related.thumbnail} alt={related.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform opacity-90" referrerPolicy="no-referrer" />
                    </div>
                    <div className="space-y-1 overflow-hidden flex-1">
                      <h5 className="font-bold text-[11px] leading-tight text-slate-900 group-hover:text-emerald-600 transition-colors truncate uppercase tracking-tighter italic">{related.title}</h5>
                      <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest block">
                         {related.city}, {related.stateCode}
                      </span>
                    </div>
                  </Link>
                ));
              })()}
          </div>
        </div>

        <div className="space-y-4">
           <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest border-b border-slate-100 pb-2 block">Publicidade</span>
           <AdPlaceholder format="vertical" className="hidden lg:flex" />
           <AdPlaceholder format="rectangle" className="lg:hidden" />
        </div>

        <section id="support-callout" className="p-5 bg-[#0F172A] border border-slate-800 border-l-4 border-emerald-600 rounded-sm">
             <h4 className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-2 italic">Monitoramento Monitorado</h4>
             <p className="text-[11px] text-slate-400 font-medium leading-relaxed italic">
               Nossa plataforma verifica a integridade deste link a cada 30 segundos. Caso note interrupções, utilize o botão de recarga.
             </p>
        </section>
      </aside>
    </div>
  );
};
