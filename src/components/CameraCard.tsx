import React from 'react';
import { Camera, MapPin, Eye, PlayCircle, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Camera as CameraType } from '../types';

interface CameraCardProps {
  camera: CameraType;
}

export const CameraCard: React.FC<CameraCardProps> = ({ camera }) => {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="bg-white rounded-sm border border-slate-200 overflow-hidden shadow-sm flex flex-col group h-full"
    >
      <Link to={`/camera/${camera.slug}`} className="block relative aspect-video overflow-hidden bg-slate-900">
        <img 
          src={camera.thumbnail} 
          alt={`Câmera ao vivo: ${camera.title}`}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-80 group-hover:opacity-100"
          loading="lazy"
        />
        <div className="absolute top-3 left-3 flex items-center gap-2 bg-red-600 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded-full ring-2 ring-white/20">
            <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
            Ao Vivo
        </div>
        <div className="absolute bottom-3 right-3 text-white/90 text-[10px] font-mono bg-black/40 px-2 py-1 backdrop-blur-md rounded-sm">
            {camera.views.toLocaleString()} assistindo
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
            <p className="text-white font-bold text-lg leading-tight uppercase tracking-tight line-clamp-1">{camera.title}</p>
        </div>
      </Link>
      
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div className="space-y-2 mb-4">
          <div className="flex justify-between items-start">
            <Link 
              to={`/estado/${camera.stateCode.toLowerCase()}`}
              className="text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:text-[#059669] transition-colors"
            >
              {camera.city}, {camera.stateCode}
            </Link>
            <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">HD 1080p</span>
          </div>
          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
            {camera.description}
          </p>
        </div>
        
        <Link 
          to={`/camera/${camera.slug}`}
          className="text-[10px] font-black text-[#059669] uppercase tracking-[0.2em] flex items-center gap-2 group-hover:translate-x-1 transition-transform"
        >
          Ver Câmera <ChevronRight className="w-3 h-3" />
        </Link>
      </div>
    </motion.div>
  );
};
