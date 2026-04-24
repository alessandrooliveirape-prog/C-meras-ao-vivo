import React from 'react';
import { TrendingUp, Search } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { CAMERAS } from '../data/brazilData';
import { CameraCard } from '../components/CameraCard';
import { AdPlaceholder } from '../components/AdPlaceholder';
import { SEO } from '../components/SEO';
import { Breadcrumbs } from '../components/Breadcrumbs';

export const PopularesPage: React.FC = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get('q')?.toLowerCase() || '';

  const filteredCameras = CAMERAS.filter(camera => 
    camera.title.toLowerCase().includes(query) ||
    camera.city.toLowerCase().includes(query) ||
    camera.state.toLowerCase().includes(query) ||
    camera.stateCode.toLowerCase().includes(query) ||
    camera.tags.some(tag => tag.toLowerCase().includes(query))
  );

  const sortedCameras = [...filteredCameras].sort((a, b) => b.views - a.views);

  return (
    <div className="flex-1 flex flex-col xl:flex-row overflow-hidden bg-[#F1F5F9]">
      <SEO 
        title={query ? `Resultados para "${query}" - Brasil ao Vivo` : "Câmeras Populares - Brasil ao Vivo"}
        description="Confira as câmeras mais assistidas do Brasil agora. O trânsito mais movimentado e as praias mais lotadas em tempo real."
      />
      
      <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8">
        <Breadcrumbs />

        <section>
          <div className="flex items-center gap-3 mb-8 border-l-4 border-emerald-600 pl-4">
            {query ? <Search className="text-emerald-600 w-6 h-6" /> : <TrendingUp className="text-emerald-600 w-6 h-6" />}
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic">
              {query ? `Busca: ${query}` : "Câmeras Mais Populares"}
            </h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {sortedCameras.map((camera) => (
              <CameraCard key={camera.id} camera={camera} />
            ))}
          </div>

          {sortedCameras.length === 0 && (
            <div className="py-20 text-center bg-white border border-dashed border-slate-300 rounded-sm">
                <Search className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Nenhuma câmera encontrada para "{query}"</p>
                <button 
                  onClick={() => window.history.back()}
                  className="mt-4 text-emerald-600 text-[10px] font-black uppercase tracking-widest hover:underline"
                >
                  Voltar e tentar novamente
                </button>
            </div>
          )}
        </section>
      </div>

      <aside className="w-full xl:w-80 bg-white border-l border-slate-200 p-6 space-y-8">
        <div>
          <span className="text-[10px] uppercase font-black text-slate-400 tracking-[0.2em] mb-4 border-b border-slate-100 pb-2 block">Destaque do Mês</span>
          <div className="bg-slate-900 text-white p-6 rounded-sm shadow-xl">
             <h3 className="text-xs font-black uppercase tracking-widest text-emerald-400 mb-2">Monitoramento 24h</h3>
             <p className="text-[11px] font-medium leading-relaxed italic opacity-80">
               Nossa rede utiliza feeds públicos e parcerias para trazer a melhor visão das cidades brasileiras.
             </p>
          </div>
        </div>
        <AdPlaceholder format="vertical" />
      </aside>
    </div>
  );
};
