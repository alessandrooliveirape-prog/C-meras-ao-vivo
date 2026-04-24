import React from 'react';
import { Link } from 'react-router-dom';
import { Camera, MapPin, Search, Menu, X, Facebook, Twitter, Instagram, Youtube, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#F1F5F9]">
      <Header />
      <div className="flex-1 flex flex-col overflow-hidden">
        {children}
      </div>
      <Footer />
    </div>
  );
};

export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Por enquanto, apenas alerta ou redireciona, 
      // mas podemos implementar uma página de busca.
      // Vou redirecionar para populares se não souber o que fazer
      navigate(`/populares?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-[#0F172A] border-b-4 border-[#059669]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-[#059669] rounded-sm flex items-center justify-center font-bold text-white transition-transform group-hover:scale-105">
                B
            </div>
            <span className="font-black text-xl tracking-tighter text-white uppercase">
              BRASIL<span className="text-[#059669]">AO</span>VIVO
            </span>
          </Link>

          {/* Search Bar - Integrated style */}
          <form onSubmit={handleSearch} className="hidden md:block flex-1 max-w-md mx-8">
            <div className="relative">
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar cidade, estado ou ponto turístico..." 
                className="w-full bg-slate-800 border-none rounded-sm px-4 py-2 text-sm text-slate-300 focus:ring-2 focus:ring-[#059669] outline-none"
              />
              <button type="submit" className="absolute right-3 top-2.5 text-slate-500 hover:text-white transition-colors">
                <Search className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-6 text-xs font-bold text-slate-400 uppercase tracking-widest">
            <Link to="/" className="text-white border-b border-[#059669] pb-0.5 hover:text-white transition-colors">Início</Link>
            <Link to="/estados" className="hover:text-white transition-colors">Estados</Link>
            <Link to="/populares" className="hover:text-white transition-colors">Populares</Link>
            <Link to="/contato" className="hover:text-white transition-colors">Contato</Link>
          </nav>

          <div className="flex items-center gap-3">
            <button className="md:hidden p-2 text-slate-400 hover:text-white transition-colors">
              <Search className="w-5 h-5" />
            </button>
            <button 
              className="lg:hidden p-2 text-slate-400 hover:text-white transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="lg:hidden bg-[#0F172A] border-t border-slate-800 pb-6"
          >
            <div className="px-4 space-y-4 pt-4">
              <Link to="/" className="block py-2 text-sm font-black text-white uppercase tracking-widest">Início</Link>
              <Link to="/estados" className="block py-2 text-sm font-black text-white uppercase tracking-widest">Estados</Link>
              <Link to="/populares" className="block py-2 text-sm font-black text-white uppercase tracking-widest">Populares</Link>
              <Link to="/contato" className="block py-2 text-sm font-black text-white uppercase tracking-widest">Contato</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-slate-200 px-4 sm:px-8 py-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex flex-wrap justify-center md:justify-start gap-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          <Link to="/privacidade" className="hover:text-slate-900 transition-colors">Política de Privacidade</Link>
          <Link to="/termos" className="hover:text-slate-900 transition-colors">Termos de Uso</Link>
          <Link to="/api" className="hover:text-slate-900 transition-colors">API para Desenvolvedores</Link>
        </div>
        
        <div className="flex items-center gap-3 text-[10px] font-bold text-slate-400">
          <span className="uppercase tracking-widest">&copy; 2024 BRASIL AO VIVO</span>
          <span className="hidden sm:block w-1 h-1 bg-slate-300 rounded-full"></span>
          <span className="hidden sm:block text-emerald-600 uppercase tracking-widest">O maior portal de monitoramento do Brasil</span>
        </div>
      </div>
    </footer>
  );
};
