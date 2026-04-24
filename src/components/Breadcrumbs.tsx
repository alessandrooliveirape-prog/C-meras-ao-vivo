import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export const Breadcrumbs: React.FC = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  if (pathnames.length === 0) return null;

  return (
    <nav className="flex mb-6 text-[10px] font-bold uppercase tracking-widest text-slate-400 overflow-x-auto pb-2 scrollbar-hide" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2 whitespace-nowrap">
        <li>
          <Link to="/" className="flex items-center hover:text-emerald-600 transition-colors">
            <span>Home</span>
          </Link>
        </li>
        {pathnames.map((value, index) => {
          const last = index === pathnames.length - 1;
          const to = `/${pathnames.slice(0, index + 1).join('/')}`;
          const label = value.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());

          return (
            <li key={to} className="flex items-center space-x-2">
              <span className="text-slate-300">/</span>
              {last ? (
                <span className="text-slate-900 font-black">
                  {label}
                </span>
              ) : (
                <Link to={to} className="hover:text-emerald-600 transition-colors">
                  {label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
