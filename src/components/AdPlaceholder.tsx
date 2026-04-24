import React from 'react';

interface AdPlaceholderProps {
  slot?: string;
  format?: 'horizontal' | 'vertical' | 'rectangle';
  className?: string;
}

export const AdPlaceholder: React.FC<AdPlaceholderProps> = ({ format = 'rectangle', className }) => {
  const styles = {
    horizontal: 'w-full h-[90px]',
    vertical: 'w-[160px] h-[600px]',
    rectangle: 'w-full aspect-[4/3] sm:aspect-video',
  };

  return (
    <div 
      className={`bg-slate-100 border border-dashed border-slate-300 flex flex-col items-center justify-center rounded-sm overflow-hidden p-6 text-center ${styles[format]} ${className}`}
      aria-hidden="true"
    >
      <span className="text-[10px] uppercase font-bold text-slate-500 tracking-widest mb-2">Publicidade</span>
      <div className="flex flex-col items-center justify-center">
        <div className="text-xl font-bold text-slate-400">
          {format === 'horizontal' ? '728 x 90' : format === 'vertical' ? '160 x 600' : '300 x 250'}
        </div>
        <div className="text-[10px] text-slate-400 italic mt-1 font-mono uppercase tracking-tighter">Google AdSense Banner</div>
      </div>
    </div>
  );
};
