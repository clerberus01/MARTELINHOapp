
import React, { useState } from 'react';
import { CATEGORIES } from '../constants';
import Logo from './Logo';

interface OnboardingProps {
  onComplete: (interests: string[]) => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (id: string) => {
    setSelected(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="fixed inset-0 z-[100] bg-yellow-400 flex flex-col items-center justify-center p-6 overflow-y-auto">
      <div className="max-w-2xl w-full space-y-8 py-12">
        <div className="text-center space-y-4">
          <Logo className="h-20 justify-center" />
          <h2 className="text-3xl font-black text-black uppercase italic tracking-tighter">
            O QUE VOCÊ GOSTA DE GARIMPAR?
          </h2>
          <p className="font-bold text-black/60 uppercase text-xs tracking-widest">
            Selecione pelo menos 3 categorias para a gente bater o martelo nas melhores ofertas pra você.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => toggle(cat.id)}
              className={`p-4 rounded-2xl border-4 border-black transition-all flex flex-col items-center gap-2 text-center
                ${selected.includes(cat.id) 
                  ? 'bg-black text-yellow-400 shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]' 
                  : 'bg-white text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'}`}
            >
              <span className="text-3xl">{cat.icon}</span>
              <span className="text-[10px] font-black uppercase leading-tight">{cat.name}</span>
            </button>
          ))}
        </div>

        <div className="pt-8 text-center">
          <button
            disabled={selected.length < 3}
            onClick={() => onComplete(selected)}
            className={`w-full max-w-sm py-5 rounded-2xl font-black text-xl uppercase tracking-tighter shadow-xl transition-all
              ${selected.length >= 3 
                ? 'bg-black text-yellow-400 hover:scale-105 active:scale-95' 
                : 'bg-black/20 text-black/40 cursor-not-allowed'}`}
          >
            {selected.length < 3 ? `Escolha mais ${3 - selected.length}` : 'Bora fazer negócio! 🚀'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
