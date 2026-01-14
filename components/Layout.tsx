
import React from 'react';
import { User } from '../types';
import Logo from './Logo';

interface LayoutProps {
  children: React.ReactNode;
  onNavigate: (page: 'home' | 'create' | 'profile') => void;
  currentPage: string;
  user: User;
}

const Layout: React.FC<LayoutProps> = ({ children, onNavigate, currentPage, user }) => {
  return (
    <div className="min-h-screen flex flex-col bg-[#FFFCF0] pb-20 md:pb-0">
      <header className="sticky top-0 z-50 bg-yellow-400 border-b-4 border-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="cursor-pointer" onClick={() => onNavigate('home')}>
              <Logo className="h-10" />
            </div>

            <nav className="hidden md:flex items-center space-x-6">
              <button 
                onClick={() => onNavigate('home')}
                className={`text-sm font-black uppercase tracking-tight px-3 py-2 rounded-lg transition-all ${currentPage === 'home' ? 'bg-black text-white' : 'text-black hover:bg-yellow-500'}`}
              >
                Comprar
              </button>
              <button 
                onClick={() => onNavigate('create')}
                className={`text-sm font-black uppercase tracking-tight px-3 py-2 rounded-lg transition-all ${currentPage === 'create' ? 'bg-black text-white' : 'text-black hover:bg-yellow-500'}`}
              >
                Vender
              </button>
              <button 
                onClick={() => onNavigate('profile')}
                className={`text-sm font-black uppercase tracking-tight px-3 py-2 rounded-lg transition-all ${currentPage === 'profile' ? 'bg-black text-white' : 'text-black hover:bg-yellow-500'}`}
              >
                Meu Perfil
              </button>
            </nav>

            <div className="flex items-center gap-4">
              <div className="hidden sm:flex flex-col items-end leading-tight">
                <span className="text-[10px] text-black/60 font-black uppercase">Saldo Martelinho</span>
                <span className="text-lg font-black text-black">R$ {(user.balance + user.creditBalance).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                {user.creditBalance > 0 && (
                  <span className="text-[8px] bg-black text-emerald-400 px-1 rounded font-black uppercase mt-1">Sendo R$ {user.creditBalance.toFixed(2)} em créditos</span>
                )}
              </div>
              <div 
                className="w-12 h-12 rounded-full border-4 border-black bg-white overflow-hidden shadow-md cursor-pointer hover:scale-110 transition-transform active:scale-95"
                onClick={() => onNavigate('profile')}
              >
                <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {children}
      </main>

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-black border-t-4 border-yellow-400 md:hidden flex justify-around items-center h-20 px-6">
        <button 
          onClick={() => onNavigate('home')}
          className={`flex flex-col items-center justify-center gap-1 transition-all ${currentPage === 'home' ? 'text-yellow-400 scale-110' : 'text-white/60'}`}
        >
          <span className="text-2xl">🔍</span>
          <span className="text-[10px] font-black uppercase tracking-widest">Comprar</span>
        </button>
        <div className="h-10 w-px bg-yellow-400/20"></div>
        <button 
          onClick={() => onNavigate('create')}
          className={`flex flex-col items-center justify-center gap-1 transition-all ${currentPage === 'create' ? 'text-yellow-400 scale-110' : 'text-white/60'}`}
        >
          <span className="text-2xl">🔨</span>
          <span className="text-[10px] font-black uppercase tracking-widest">Vender</span>
        </button>
        <div className="h-10 w-px bg-yellow-400/20"></div>
        <button 
          onClick={() => onNavigate('profile')}
          className={`flex flex-col items-center justify-center gap-1 transition-all ${currentPage === 'profile' ? 'text-yellow-400 scale-110' : 'text-white/60'}`}
        >
          <span className="text-2xl">👤</span>
          <span className="text-[10px] font-black uppercase tracking-widest">Perfil</span>
        </button>
      </div>

      <footer className="bg-black text-white py-12 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-3">
               <Logo className="h-12" color="#FACC15" />
            </div>
            <div className="text-center md:text-right">
              <p className="text-yellow-400 font-bold mb-1 uppercase text-xs">Atenção: Não somos responsáveis por entregas</p>
              <p className="text-slate-400 text-[10px] max-w-xs uppercase font-black tracking-tighter">
                O frete deve ser combinado entre as partes. Garantimos apenas que o dinheiro chegue ao destino após a confirmação.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
