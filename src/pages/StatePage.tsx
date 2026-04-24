import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Camera as CameraIcon, ChevronRight } from 'lucide-react';
import { BRAZIL_STATES, CAMERAS } from '../data/brazilData';
import { CameraCard } from '../components/CameraCard';
import { AdPlaceholder } from '../components/AdPlaceholder';
import { SEO } from '../components/SEO';
import { Breadcrumbs } from '../components/Breadcrumbs';

export const StatePage: React.FC = () => {
  const { code } = useParams<{ code: string }>();
  const state = BRAZIL_STATES.find(s => s.code.toLowerCase() === code?.toLowerCase());

  if (!state) {
    return <div className="text-center py-20 font-bold uppercase tracking-widest text-slate-400">Estado não encontrado.</div>;
  }

  const stateCameras = CAMERAS.filter(c => c.stateCode === state.code);

  return (
    <div className="flex-1 flex flex-col xl:flex-row overflow-hidden bg-[#F1F5F9]">
      <SEO 
        title={`Câmeras ao Vivo em ${state.name} (${state.code})`}
        description={state.description}
      />
      
      <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8">
        <Breadcrumbs />

        <section className="bg-white rounded-sm border border-slate-200 p-8 shadow-sm overflow-hidden relative">
            <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                <span className="text-[12rem] font-black leading-none">{state.code}</span>
            </div>
            <div className="relative z-10 space-y-4 max-w-2xl">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] bg-[#059669] text-white font-black uppercase px-2 py-0.5 rounded-sm">Região {state.region}</span>
              </div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic">
                {state.name}
              </h1>
              <p className="text-xs text-slate-500 font-bold leading-relaxed max-w-xl">
                {state.description}
              </p>
            </div>
        </section>

        <section>
            <div className="mb-6 border-l-4 border-emerald-600 pl-4">
                <h2 className="text-xl font-black text-slate-900 tracking-tighter uppercase italic">Cidades em Destaque</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {state.cities.map(city => (
                <Link 
                    key={city.slug} 
                    to={`/estado/${state.code.toLowerCase()}/${city.slug}`}
                    className="p-5 bg-white border border-slate-200 rounded-sm flex items-center justify-between group hover:border-emerald-600 transition-all shadow-sm"
                >
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                        <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                    <h3 className="text-xs font-black text-slate-900 uppercase tracking-tight group-hover:text-emerald-600">{city.name}</h3>
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{city.cameraCount} Câmeras Online</p>
                    </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
                </Link>
            ))}
            </div>
        </section>

        <section>
            <div className="mb-6 border-l-4 border-emerald-600 pl-4">
                <h2 className="text-xl font-black text-slate-900 tracking-tighter uppercase italic">Câmeras em {state.name}</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {stateCameras.map(camera => (
                <CameraCard key={camera.id} camera={camera} />
            ))}
            {stateCameras.length === 0 && (
                <div className="col-span-full py-16 text-center bg-white rounded-sm border border-dashed border-slate-300">
                    <CameraIcon className="w-10 h-10 text-slate-200 mx-auto mb-4" />
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">Buscando novas fontes de vídeo nesta região...</p>
                </div>
            )}
            </div>
        </section>
      </div>

      <aside className="w-full xl:w-80 bg-white border-l border-slate-200 p-6 space-y-8 overflow-y-auto">
        <div className="space-y-4">
           <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest border-b border-slate-100 pb-2 block">Premium Ad</span>
           <AdPlaceholder format="vertical" className="hidden lg:flex" />
           <AdPlaceholder format="rectangle" className="lg:hidden" />
        </div>
      </aside>
    </div>
  );
};
