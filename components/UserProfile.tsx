
import React, { useState } from 'react';
import { AuctionItem, User, AuctionStatus } from '../types';
import AuctionCard from './AuctionCard';

interface UserProfileProps {
  user: User;
  auctions: AuctionItem[];
  onUpdateUser: (updatedUser: User) => void;
  onViewAuction: (id: string) => void;
  onBack: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ user, auctions, onUpdateUser, onViewAuction, onBack }) => {
  const [activeTab, setActiveTab] = useState<'activity' | 'settings'>('activity');
  const [newNick, setNewNick] = useState(user.name);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  const myBids = auctions.filter(a => a.winnerId === 'me' || a.winnerId === user.id);
  const mySales = auctions.filter(a => a.sellerId === 'me' || a.sellerId === user.id);

  const stats = [
    { label: 'Arrematados', value: myBids.length, icon: '🏆' },
    { label: 'Meus Desapegos', value: mySales.length, icon: '🔨' },
    { label: 'Saldo Livre', value: `R$ ${user.balance.toFixed(2)}`, icon: '💰' },
  ];

  // Regra de 30 dias
  const daysSinceLastChange = user.lastNickChange 
    ? Math.floor((Date.now() - user.lastNickChange) / (1000 * 60 * 60 * 24)) 
    : 31; // Se nunca trocou, permite
  const canChangeNick = daysSinceLastChange >= 30;
  const daysRemaining = 30 - daysSinceLastChange;

  const handleUpdateNick = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canChangeNick) return;
    if (newNick === user.name) return;
    
    const updatedUser = { 
      ...user, 
      name: newNick, 
      lastNickChange: Date.now() 
    };
    onUpdateUser(updatedUser);
    setSaveStatus('Nick atualizado com sucesso! 🚀');
    setTimeout(() => setSaveStatus(null), 3000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      {/* Header do Perfil */}
      <div className="bg-white border-8 border-black rounded-[40px] p-8 sm:p-12 shadow-[15px_15px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
          <div className="relative">
            <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-8 border-black bg-yellow-400 overflow-hidden shadow-lg">
              <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
            </div>
          </div>
          
          <div className="text-center md:text-left space-y-2">
            <h2 className="text-4xl sm:text-5xl font-black uppercase italic tracking-tighter text-black">
              @{user.name}
            </h2>
            <p className="text-black/50 font-bold uppercase text-xs tracking-widest">{user.fullName}</p>
            <div className="flex flex-wrap justify-center md:justify-start gap-3 pt-2">
              <span className="bg-black text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase border-2 border-black">
                📍 {user.address}
              </span>
            </div>
          </div>
        </div>

        {/* Estatísticas Rápidas */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12">
          {stats.map((stat, i) => (
            <div key={i} className="bg-zinc-50 border-4 border-black p-6 rounded-3xl flex items-center gap-4 hover:bg-yellow-50 transition-colors shadow-sm">
              <span className="text-4xl">{stat.icon}</span>
              <div>
                <p className="text-[10px] font-black uppercase text-black/40">{stat.label}</p>
                <p className="text-2xl font-black">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navegação de Abas */}
      <div className="flex gap-4 px-4 overflow-x-auto pb-2">
        <button 
          onClick={() => setActiveTab('activity')}
          className={`px-8 py-4 rounded-2xl border-4 border-black font-black uppercase text-xs transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center gap-2 flex-shrink-0 ${activeTab === 'activity' ? 'bg-black text-yellow-400' : 'bg-white text-black'}`}
        >
          📈 Histórico de Atividade
        </button>
        <button 
          onClick={() => setActiveTab('settings')}
          className={`px-8 py-4 rounded-2xl border-4 border-black font-black uppercase text-xs transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center gap-2 flex-shrink-0 ${activeTab === 'settings' ? 'bg-black text-yellow-400' : 'bg-white text-black'}`}
        >
          ⚙️ Configurações
        </button>
      </div>

      {activeTab === 'activity' ? (
        <div className="space-y-12">
          {/* Meus Arremates */}
          <section className="space-y-6">
            <div className="flex items-center gap-4 px-4">
              <span className="text-4xl">🏆</span>
              <h3 className="text-3xl font-black uppercase italic tracking-tighter text-black">Itens Arrematados</h3>
            </div>
            
            {myBids.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 px-4">
                {myBids.map(a => (
                  <AuctionCard key={a.id} auction={a} onView={onViewAuction} />
                ))}
              </div>
            ) : (
              <div className="bg-white border-4 border-dashed border-black/20 p-12 rounded-[40px] text-center mx-4">
                <p className="text-xl font-black uppercase italic text-black/20">Ainda não arrematou nada? A diversão está nos lances!</p>
              </div>
            )}
          </section>

          {/* Meus Desapegos */}
          <section className="space-y-6">
            <div className="flex items-center gap-4 px-4">
              <span className="text-4xl">🔨</span>
              <h3 className="text-3xl font-black uppercase italic tracking-tighter text-black">Meus Desapegos</h3>
            </div>
            
            {mySales.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 px-4">
                {mySales.map(a => (
                  <AuctionCard key={a.id} auction={a} onView={onViewAuction} />
                ))}
              </div>
            ) : (
              <div className="bg-white border-4 border-dashed border-black/20 p-12 rounded-[40px] text-center mx-4">
                <p className="text-xl font-black uppercase italic text-black/20">Desapegue! Sua casa e seu bolso agradecem.</p>
              </div>
            )}
          </section>
        </div>
      ) : (
        <div className="px-4">
          <div className="bg-white border-8 border-black rounded-[40px] p-8 sm:p-12 shadow-[15px_15px_0px_0px_rgba(0,0,0,1)] max-w-2xl">
            <h3 className="text-3xl font-black uppercase italic tracking-tighter text-black mb-8 flex items-center gap-3">
              <span>👤</span> Configurar Perfil
            </h3>

            <form onSubmit={handleUpdateNick} className="space-y-8">
              <div>
                <label className="block text-[10px] font-black uppercase mb-3 text-black/60 tracking-widest">Apelido na Plataforma (@)</label>
                <div className="relative">
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 font-black text-2xl text-black/20">@</span>
                  <input 
                    type="text" 
                    disabled={!canChangeNick}
                    value={newNick}
                    onChange={(e) => setNewNick(e.target.value.toLowerCase().replace(/\s/g, '_'))}
                    className={`w-full bg-zinc-50 border-4 border-black p-5 pl-12 rounded-2xl font-black uppercase text-xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] outline-none focus:ring-4 focus:ring-yellow-400 ${!canChangeNick ? 'opacity-50 cursor-not-allowed' : ''}`}
                  />
                </div>
                
                {!canChangeNick && (
                  <div className="mt-4 bg-yellow-100 border-4 border-yellow-500 p-4 rounded-xl flex items-center gap-3 animate-pulse">
                    <span className="text-2xl">⏳</span>
                    <p className="text-[10px] font-black uppercase text-yellow-800 leading-tight">
                      Bloqueio de Troca Ativo: Você só poderá mudar seu nick novamente em <span className="text-black text-sm">{daysRemaining} dias</span>.
                    </p>
                  </div>
                )}
                
                <p className="mt-4 text-[10px] font-bold text-black/40 uppercase leading-relaxed">
                  * O apelido é como as pessoas te identificam nas disputas de lances. Escolha com sabedoria, pois você só pode trocá-lo a cada 30 dias.
                </p>
              </div>

              {saveStatus && (
                <div className="bg-emerald-500 text-white p-4 rounded-xl border-4 border-black font-black uppercase text-center animate-bounce">
                  {saveStatus}
                </div>
              )}

              <button 
                type="submit"
                disabled={!canChangeNick || newNick === user.name}
                className={`w-full py-6 rounded-2xl font-black text-2xl uppercase shadow-[0_10px_0_0_#000] border-4 border-black transition-all active:translate-y-2 active:shadow-none
                  ${canChangeNick && newNick !== user.name 
                    ? 'bg-yellow-400 text-black hover:bg-yellow-300' 
                    : 'bg-zinc-200 text-zinc-400 border-zinc-300 cursor-not-allowed shadow-none'}`}
              >
                Salvar Alterações 🔨
              </button>
            </form>

            <div className="mt-12 pt-12 border-t-4 border-dashed border-black/10">
              <h4 className="text-[10px] font-black uppercase text-black/40 mb-4 tracking-[0.2em]">Sua conta Martelinho</h4>
              <p className="text-xs font-bold text-black">E-mail: <span className="text-black/50">{user.email || 'Não vinculado'}</span></p>
              <p className="text-xs font-bold text-black mt-2">CPF: <span className="text-black/50">{user.cpf}</span></p>
              <p className="text-xs font-bold text-black mt-2">Endereço: <span className="text-black/50">{user.address}</span></p>
              <p className="mt-6 text-[9px] font-black uppercase text-red-500 underline cursor-pointer hover:bg-red-50 inline-block px-2 py-1 rounded">Sair da minha conta</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
