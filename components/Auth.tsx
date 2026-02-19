
import React, { useState } from 'react';
import Logo from './Logo';
import { PRIVACY_POLICY, TERMS_DISCLAIMER } from '../constants';

interface AuthProps {
  onLogin: (userData: any) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [agreedToLegal, setAgreedToLegal] = useState(false);
  const [agreedToPrivacy, setAgreedToPrivacy] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState<null | 'privacy' | 'terms'>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    fullName: '',
    email: '',
    phone: '',
    password: '',
    cpf: '',
    address: '',
    isTrusted: true
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLogin && (!agreedToLegal || !agreedToPrivacy)) {
      alert("Para sua segurança e conformidade com a LGPD, você deve aceitar os Termos e a Política de Privacidade individualmente.");
      return;
    }

    const mockUser = {
      id: 'user_' + Math.random().toString(36).substr(2, 5),
      name: formData.name || formData.email.replace('@', '_').split('.')[0] || 'Usuario',
      fullName: formData.fullName || 'Nome Completo',
      email: formData.email,
      phone: formData.phone || '(00) 00000-0000',
      cpf: formData.cpf || '000.000.000-00',
      address: formData.address || 'São Paulo, SP',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.name || formData.email}`,
      balance: 1000.00,
      creditBalance: 0,
      isTrustedMachine: formData.isTrusted,
      lastNickChange: Date.now(),
      reputationScore: 85,
      successfulDeals: 0,
      totalRatings: 0
    };
    onLogin(mockUser);
  };

  return (
    <div className="fixed inset-0 z-[200] bg-yellow-400 overflow-y-auto selection:bg-black selection:text-yellow-400 flex items-center justify-center p-4 sm:p-6">
      <div className="fixed inset-0 opacity-[0.02] pointer-events-none select-none overflow-hidden">
        <div className="grid grid-cols-6 gap-10 p-10 rotate-12 scale-150">
          {Array.from({ length: 36 }).map((_, i) => (
            <div key={i} className="text-6xl font-black">🔨</div>
          ))}
        </div>
      </div>

      <div className="relative w-full max-w-md">
        <div className="bg-white border-4 border-black rounded-[32px] shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
          <div className="bg-black p-6 text-center">
            <div className="inline-flex items-center justify-center p-2 bg-yellow-400 border-2 border-black rounded-xl mb-3">
              <Logo className="h-6" animated />
            </div>
            <h2 className="text-lg font-black uppercase italic tracking-tighter text-yellow-400 leading-none">
              {isLogin ? 'ENTRE NA DISPUTA' : 'CADASTRO SEGURO'}
            </h2>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {isLogin ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-black uppercase mb-1 ml-1 text-black/40 tracking-widest">E-mail ou Apelido</label>
                    <input type="text" required className="w-full px-4 py-3 rounded-xl border-2 border-black font-bold outline-none focus:bg-yellow-50 transition-all text-sm" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="seu@email.com" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase mb-1 ml-1 text-black/40 tracking-widest">Senha</label>
                    <input type="password" required className="w-full px-4 py-3 rounded-xl border-2 border-black font-bold outline-none focus:bg-yellow-50 transition-all text-sm" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} placeholder="••••••••" />
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <input type="text" required className="w-full px-4 py-2.5 rounded-xl border-2 border-black font-bold outline-none text-xs" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} placeholder="Nome Completo" />
                  <input type="text" required className="w-full px-4 py-2.5 rounded-xl border-2 border-black font-bold outline-none text-xs" value={formData.cpf} onChange={e => setFormData({...formData, cpf: e.target.value})} placeholder="CPF (Segurança Jurídica)" />
                  <input type="email" required className="w-full px-4 py-2.5 rounded-xl border-2 border-black font-bold outline-none text-xs" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="E-mail" />
                  <input type="text" required className="w-full px-4 py-2.5 rounded-xl border-2 border-black font-bold outline-none text-xs" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} placeholder="Cidade, UF (Ex: São Paulo, SP)" />
                  <input type="password" required className="w-full px-4 py-2.5 rounded-xl border-2 border-black font-bold outline-none text-xs" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} placeholder="Criar Senha" />

                  <div className="bg-zinc-50 border-2 border-black p-4 rounded-xl space-y-3 mt-4">
                    <label className="flex items-start gap-3 cursor-pointer group">
                      <input type="checkbox" required className="w-5 h-5 accent-black mt-0.5 shrink-0" checked={agreedToPrivacy} onChange={e => setAgreedToPrivacy(e.target.checked)} />
                      <span className="text-[9px] font-black uppercase text-black leading-tight group-hover:text-yellow-600 transition-colors">
                        Aceito a <button type="button" onClick={() => setShowPrivacyModal('privacy')} className="underline">Política de Privacidade (LGPD)</button>
                      </span>
                    </label>
                    <label className="flex items-start gap-3 cursor-pointer group">
                      <input type="checkbox" required className="w-5 h-5 accent-black mt-0.5 shrink-0" checked={agreedToLegal} onChange={e => setAgreedToLegal(e.target.checked)} />
                      <span className="text-[9px] font-black uppercase text-black leading-tight group-hover:text-yellow-600 transition-colors">
                        Concordo com os <button type="button" onClick={() => setShowPrivacyModal('terms')} className="underline">Termos de Uso e Mediação</button>
                      </span>
                    </label>
                  </div>
                </div>
              )}

              <button type="submit" className="w-full bg-black text-yellow-400 font-black py-4 rounded-xl uppercase text-sm shadow-[0_4px_0_0_#FACC15] hover:translate-y-1 hover:shadow-none active:scale-95 transition-all border-2 border-black">
                {isLogin ? 'ENTRAR AGORA 🔨' : 'BATER MARTELO NO CADASTRO ✅'}
              </button>
            </form>

            <div className="text-center pt-4 border-t-2 border-dashed border-black/5">
              <button onClick={() => setIsLogin(!isLogin)} className="text-[10px] font-black uppercase text-black/50 hover:text-black transition-colors">
                {isLogin ? 'Novo por aqui? ' : 'Já tem conta? '}
                <span className="text-black underline underline-offset-4 decoration-yellow-400 decoration-2">
                  {isLogin ? 'Cadastre-se' : 'Entrar'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {showPrivacyModal && (
        <div className="fixed inset-0 z-[300] bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white border-4 border-black max-w-lg w-full rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in duration-200">
             <div className="bg-black p-4 flex justify-between items-center">
                <h3 className="text-yellow-400 font-black uppercase italic tracking-tighter">
                  {showPrivacyModal === 'privacy' ? '🛡️ Política de Privacidade' : '📜 Termos de Uso'}
                </h3>
                <button onClick={() => setShowPrivacyModal(null)} className="text-white font-black">FECHAR ✕</button>
             </div>
             <div className="p-8 max-h-[60vh] overflow-y-auto font-bold uppercase text-[10px] text-zinc-600 leading-relaxed whitespace-pre-wrap">
                {showPrivacyModal === 'privacy' ? PRIVACY_POLICY.content : Object.values(TERMS_DISCLAIMER).join('\n\n')}
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Auth;
