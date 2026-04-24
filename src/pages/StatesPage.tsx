import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, ChevronRight, Globe } from 'lucide-react';
import { BRAZIL_STATES } from '../data/brazilData';
import { SEO } from '../components/SEO';
import { Breadcrumbs } from '../components/Breadcrumbs';

export const StatesPage: React.FC = () => {
  return (
    <div className="flex-1 flex flex-col xl:flex-row overflow-hidden bg-[#F1F5F9]">
      <SEO 
        title="Estados do Brasil - Câmeras ao Vivo"
        description="Explore as câmeras disponíveis em todos os estados do Brasil. Escolha um estado para ver as cidades monitoradas."
      />
      
      <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8">
        <Breadcrumbs />

        <section className="bg-white rounded-sm border border-slate-200 p-8 shadow-sm">
          <div className="mb-8 border-l-4 border-emerald-600 pl-4">
             <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic">Estados do Brasil</h1>
             <p className="text-xs text-slate-400 font-bold tracking-widest uppercase">Selecione uma região para ver as câmeras</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {BRAZIL_STATES.map((state) => (
              <Link 
                key={state.code} 
                to={`/estado/${state.code.toLowerCase()}`}
                className="group p-6 bg-slate-50 border border-slate-200 rounded-sm hover:border-emerald-600 transition-all flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white flex items-center justify-center font-black text-xl text-slate-300 group-hover:text-emerald-600 transition-colors border border-slate-100">
                        {state.code}
                    </div>
                    <div>
                        <h2 className="text-sm font-black text-slate-900 uppercase tracking-tight">{state.name}</h2>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">{state.cities.length} Cidades Monitoradas</p>
                    </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
              </Link>
            ))}
          </div>
        </section>
      </div>

      <aside className="w-full xl:w-80 bg-white border-l border-slate-200 p-6">
          <div className="p-5 bg-emerald-50 rounded-sm border-l-4 border-emerald-600">
             <Globe className="w-6 h-6 text-emerald-600 mb-2" />
             <h3 className="text-xs font-black text-emerald-900 uppercase tracking-widest mb-1">Brasil em Tempo Real</h3>
             <p className="text-[10px] text-emerald-700 font-medium leading-relaxed italic">
               Navegue pelo país e descubra novas imagens todos os dias. Estamos constantemente adicionando novas câmeras públicas.
             </p>
          </div>
      </aside>
    </div>
  );
};
