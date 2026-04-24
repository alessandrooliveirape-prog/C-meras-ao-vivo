import React from 'react';
import { motion } from 'motion/react';
import { Search, MapPin, TrendingUp, Camera, ChevronRight, Wind, Sun, CloudRain } from 'lucide-react';
import { CameraCard } from '../components/CameraCard';
import { AdPlaceholder } from '../components/AdPlaceholder';
import { CAMERAS, BRAZIL_STATES } from '../data/brazilData';
import { Link } from 'react-router-dom';
import { SEO } from '../components/SEO';

export const Home: React.FC = () => {
  return (
    <div className="flex-1 flex flex-col xl:flex-row overflow-hidden bg-[#F1F5F9]">
      <SEO 
        title="Câmeras ao Vivo do Brasil - Trânsito e Clima"
        description="Assista a streams de câmeras públicas ao vivo de diversas cidades e estados do Brasil. Veja o trânsito, clima e pontos turísticos agora."
      />

      {/* Main Column */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-12">
        {/* Banner Section */}
        <section className="bg-white border-b border-slate-200 p-8 flex justify-between items-center -mx-4 md:-mx-8 -mt-4 md:-mt-8 mb-8">
            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                <span>Brasil</span>
                <span className="text-slate-300">/</span>
                <span className="text-emerald-600 font-black uppercase tracking-tight">Todas as Câmeras</span>
            </div>
            <div className="hidden lg:flex items-center gap-4">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Destaque</span>
                <div className="bg-emerald-50 border border-emerald-100 px-4 py-2 rounded-sm text-[11px] text-emerald-800 font-bold uppercase tracking-tight">
                    🔥 245 Câmeras Online Agora
                </div>
            </div>
        </section>

        {/* Featured Grid */}
        <section>
          <div className="flex items-end justify-between mb-8 border-b-2 border-slate-200 pb-2">
            <h2 className="text-xl font-black text-slate-900 tracking-tighter uppercase italic">Câmeras em Destaque</h2>
            <Link to="/populares" className="text-[10px] font-black text-emerald-600 uppercase tracking-widest hover:translate-x-1 transition-transform flex items-center gap-1">
              Ver Tudo <ChevronRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {CAMERAS.map((camera) => (
              <CameraCard key={camera.id} camera={camera} />
            ))}
          </div>
        </section>

        {/* State Grid */}
        <section className="bg-white rounded-sm border border-slate-200 p-8 shadow-sm">
          <div className="mb-8 border-l-4 border-emerald-600 pl-4 flex items-center justify-between">
             <div>
                <h2 className="text-xl font-black text-slate-900 tracking-tighter uppercase italic">Navegar por Estados</h2>
                <p className="text-xs text-slate-400 font-bold tracking-widest uppercase">Selecione uma região</p>
             </div>
             <Link to="/estados" className="text-[10px] font-black text-emerald-600 uppercase tracking-widest flex items-center gap-2">
                Ver Todos <ChevronRight className="w-3 h-3" />
             </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {BRAZIL_STATES.map((state) => (
              <Link 
                key={state.code} 
                to={`/estado/${state.code.toLowerCase()}`}
                className="group flex flex-col font-bold"
              >
                <div className="h-24 bg-slate-100 rounded-sm overflow-hidden mb-2 relative">
                    <img 
                      src={`https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?auto=format&fit=crop&q=80&w=400`} 
                      className="w-full h-full object-cover opacity-40 group-hover:opacity-100 transition-all duration-700"
                      alt={state.name}
                    />
                    <div className="absolute inset-0 flex items-center justify-center font-black text-3xl text-slate-300 opacity-20 pointer-events-none group-hover:opacity-0 transition-opacity">
                        {state.code}
                    </div>
                </div>
                <span className="text-xs text-slate-900 uppercase tracking-widest group-hover:text-emerald-600 transition-colors">{state.name}</span>
                <span className="text-[10px] text-slate-400 font-bold uppercase">{state.cities.length} cidades</span>
              </Link>
            ))}
          </div>
        </section>
      </div>

      {/* Sidebar Ad/Info Panel */}
      <aside className="w-full xl:w-80 bg-white border-l border-slate-200 p-6 space-y-8 overflow-y-auto">
        <div>
          <h3 className="text-[10px] uppercase font-black text-slate-400 tracking-[0.2em] mb-4 border-b border-slate-100 pb-2">Informação Oficial</h3>
          <div className="p-5 bg-emerald-50 rounded-sm border-l-4 border-emerald-600 space-y-3">
             <p className="text-[11px] text-emerald-900 font-bold leading-tight">Monitoramento em tempo real direto das principais fontes públicas brasileiras.</p>
             <p className="text-[10px] text-emerald-700 font-medium opacity-80">Ideal para conferir o clima, trânsito e movimentação em pontos turísticos antes de sair.</p>
          </div>
        </div>

        <div className="space-y-4">
           <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest border-b border-slate-100 pb-2 block">Publicidade Lateral</span>
           <AdPlaceholder format="vertical" className="hidden lg:flex" />
           <AdPlaceholder format="rectangle" className="lg:hidden" />
        </div>

        <Link to="/mapa" className="block text-center py-4 bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.2em] hover:bg-emerald-600 transition-colors">
            Ver Mapa Interativo
        </Link>
      </aside>
    </div>
  );
};
