
import React, { useState, useEffect } from 'react';
import { User } from '../types';
import Logo from './Logo';

interface LayoutProps {
  children: React.ReactNode;
  onNavigate: (page: string) => void;
  currentPage: string;
  user: User;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, onNavigate, currentPage, user, searchQuery, onSearchChange }) => {
  const [showCookieBanner, setShowCookieBanner] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('martelinho_cookie_consent');
    if (!consent) {
      setShowCookieBanner(true);
    }
  }, []);

  const handleAcceptCookies = () => {
    localStorage.setItem('martelinho_cookie_consent', 'true');
    setShowCookieBanner(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans text-black pb-20 md:pb-0">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-zinc-200">
        <div className="max-w-[1600px] mx-auto px-4 md:px-8">
          <div className="h-16 md:h-20 flex items-center justify-between gap-4 md:gap-8">
            {/* Logo */}
            <div className="cursor-pointer shrink-0" onClick={() => onNavigate('home')}>
              <Logo className="h-7 md:h-10" />
            </div>

            {/* Search Bar - Desktop Only */}
            {currentPage === 'home' ? (
              <div className="hidden md:flex flex-grow max-w-2xl relative animate-in fade-in slide-in-from-top-1 duration-300">
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder="O que você está procurando?" 
                  className="w-full bg-zinc-100 border-none px-6 py-2.5 rounded-full text-sm focus:ring-2 ring-yellow-400 outline-none transition-all"
                />
                <button className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400">🔍</button>
              </div>
            ) : (
              <div className="hidden md:block flex-grow"></div>
            )}

            {/* Actions */}
            <nav className="flex items-center gap-2 md:gap-6 shrink-0">
              <button 
                onClick={() => onNavigate('create')}
                className="hidden md:block text-xs font-black uppercase tracking-widest bg-yellow-400 px-4 py-2 border-2 border-black hover:translate-y-[-2px] transition-transform"
              >
                Vender 🔨
              </button>
              <button 
                onClick={() => onNavigate('home')}
                className={`hidden md:block text-xs font-black uppercase tracking-widest py-2 border-b-2 transition-all ${currentPage === 'home' ? 'border-black' : 'border-transparent text-zinc-400 hover:text-black'}`}
              >
                Explorar
              </button>
              <div 
                className="flex items-center gap-3 cursor-pointer group"
                onClick={() => onNavigate('profile')}
              >
                <div className="hidden lg:flex flex-col items-end">
                  <span className="text-[10px] font-black uppercase text-zinc-400">Carteira</span>
                  <span className="text-sm font-black">R$ {user.balance.toLocaleString('pt-BR')}</span>
                </div>
                <div className="w-9 h-9 md:w-10 md:h-10 rounded-full border-2 border-black overflow-hidden bg-yellow-400 group-hover:ring-2 ring-yellow-400 transition-all">
                  <img src={user.avatar} className="w-full h-full object-cover" />
                </div>
              </div>
            </nav>
          </div>

          {currentPage === 'home' && (
            <div className="md:hidden pb-4 animate-in fade-in slide-in-from-top-1 duration-300">
              <div className="relative">
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder="Buscar desapegos..." 
                  className="w-full bg-zinc-100 border-none px-5 py-2.5 rounded-full text-sm focus:ring-2 ring-yellow-400 outline-none transition-all"
                />
                <button className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400">🔍</button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow w-full max-w-[1600px] mx-auto px-4 md:px-8 py-6 md:py-10">
        {children}
      </main>

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-zinc-200 md:hidden flex justify-around items-center h-16">
        <button onClick={() => onNavigate('home')} className={`text-xl ${currentPage === 'home' ? 'text-black font-black' : 'text-zinc-300'}`}>🏠</button>
        <button onClick={() => onNavigate('create')} className={`text-3xl ${currentPage === 'create' ? 'text-black' : 'text-zinc-300'}`}>🔨</button>
        <button onClick={() => onNavigate('profile')} className={`text-xl ${currentPage === 'profile' ? 'text-black' : 'text-zinc-300'}`}>👤</button>
      </div>

      {/* Cookie Banner */}
      {showCookieBanner && (
        <div className="fixed bottom-20 md:bottom-8 left-4 right-4 md:left-auto md:right-8 z-50">
          <div className="bg-black text-white p-4 md:p-6 rounded-xl shadow-2xl flex flex-col md:flex-row items-center gap-4 max-w-lg border-2 border-yellow-400">
            <p className="text-[10px] md:text-xs font-bold uppercase tracking-tight text-center md:text-left">
              Bate o martelo na privacidade? Usamos cookies para suas disputas serem seguras conforme a LGPD.
            </p>
            <button 
              onClick={handleAcceptCookies}
              className="whitespace-nowrap bg-yellow-400 text-black px-4 py-2 text-[10px] font-black uppercase border border-black hover:bg-white transition-all"
            >
              Aceitar 🔨
            </button>
          </div>
        </div>
      )}

      <footer className="bg-zinc-50 border-t border-zinc-200 py-12 hidden md:block mt-20">
        <div className="max-w-[1600px] mx-auto px-8 grid grid-cols-4 gap-10">
          <div className="col-span-1">
            <Logo className="h-8 mb-4 opacity-50 cursor-pointer" onClick={() => onNavigate('home')} />
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest leading-relaxed">
              Intermediação transparente de desapegos. Segurança total em cada batida de martelo.
            </p>
          </div>
          <div className="space-y-4">
            <h4 className="text-[11px] font-black uppercase tracking-widest">Plataforma</h4>
            <ul className="space-y-2 text-[10px] font-bold text-zinc-400 uppercase">
              <li className="hover:text-black cursor-pointer transition-colors" onClick={() => onNavigate('how-it-works')}>Como funciona</li>
              <li className="hover:text-black cursor-pointer transition-colors" onClick={() => onNavigate('fees')}>Taxas e Prazos</li>
              <li className="hover:text-black cursor-pointer transition-colors" onClick={() => onNavigate('lgpd')}>Segurança LGPD</li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="text-[11px] font-black uppercase tracking-widest">Categorias</h4>
            <ul className="space-y-2 text-[10px] font-bold text-zinc-400 uppercase">
              <li className="hover:text-black cursor-pointer">Eletrônicos</li>
              <li className="hover:text-black cursor-pointer">Instrumentos</li>
              <li className="hover:text-black cursor-pointer">Raridades</li>
            </ul>
          </div>
          <div className="bg-black p-6 flex flex-col justify-between">
            <p className="text-yellow-400 font-black text-xs italic tracking-tighter">DESAPEGO É DINHEIRO NO BOLSO.</p>
            <p className="text-white/40 text-[9px] font-bold uppercase tracking-widest mt-4">© 2024 Martelinho S.A.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
