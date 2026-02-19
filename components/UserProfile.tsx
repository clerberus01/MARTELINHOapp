
import React, { useState, useRef } from 'react';
import { AuctionItem, User, AuctionStatus } from '../types';
import AuctionCard from './AuctionCard';

interface UserProfileProps {
  user: User;
  auctions: AuctionItem[];
  onUpdateUser: (updatedUser: User) => void;
  onLogout: () => void;
  onViewAuction: (id: string) => void;
  onBack: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ user, auctions, onUpdateUser, onLogout, onViewAuction, onBack }) => {
  const [activeTab, setActiveTab] = useState<'activity' | 'settings'>('activity');
  const [newNick, setNewNick] = useState(user.name);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const myBids = auctions.filter(a => a.winnerId === 'me' || a.winnerId === user.id);
  const mySales = auctions.filter(a => a.sellerId === 'me' || a.sellerId === user.id);

  const reputation = user.reputationScore || 0;
  const getReputationLevel = (score: number) => {
    if (score >= 95) return { label: 'Ouro', icon: '🏆', color: 'bg-yellow-400 text-black' };
    if (score >= 80) return { label: 'Verificado', icon: '🛡️', color: 'bg-blue-600 text-white' };
    return { label: 'Iniciante', icon: '🥚', color: 'bg-zinc-100 text-zinc-500 border-zinc-200' };
  };
  const level = getReputationLevel(reputation);

  const stats = [
    { label: 'Compras', value: myBids.length, icon: '🏆' },
    { label: 'Vendas', value: mySales.length, icon: '🔨' },
    { label: 'Carteira', value: `R$${user.balance.toFixed(0)}`, icon: '💰' },
  ];

  const handleAvatarClick = () => fileInputRef.current?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpdateUser({ ...user, avatar: reader.result as string });
        setSaveStatus('OK!');
        setTimeout(() => setSaveStatus(null), 2000);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateNick = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({ ...user, name: newNick, lastNickChange: Date.now() });
    setSaveStatus('Salvo!');
    setTimeout(() => setSaveStatus(null), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4 pb-10 px-2 sm:px-4">
      {/* Mini Profile Card */}
      <div className="bg-white border-2 border-black rounded-2xl p-4 sm:p-5 shadow-[4px_4px_0px_0px_#000] relative">
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
          {/* Avatar Section */}
          <div className="relative group shrink-0">
            <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-xl border-2 border-black bg-yellow-400 overflow-hidden">
              <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
            </div>
            <button onClick={handleAvatarClick} className="absolute -bottom-1 -right-1 bg-yellow-400 text-black border-2 border-black w-6 h-6 rounded-lg flex items-center justify-center text-[10px] shadow-[1px_1px_0px_0px_#000]">📷</button>
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
          </div>
          
          {/* Info Section */}
          <div className="flex-grow text-center sm:text-left min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
              <h2 className="text-xl font-black uppercase italic tracking-tighter truncate">@{user.name}</h2>
              <div className={`inline-flex self-center sm:self-auto items-center gap-1 px-2 py-0.5 rounded-lg border border-black text-[8px] font-black uppercase ${level.color}`}>
                <span>{level.icon}</span> {level.label}
              </div>
            </div>
            <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest mb-3">📍 {user.address}</p>
            
            {/* Stats Row */}
            <div className="flex flex-wrap justify-center sm:justify-start gap-4">
              {stats.map((stat, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <span className="text-xs">{stat.icon}</span>
                  <div className="flex flex-col leading-none">
                    <span className="text-[7px] font-black text-zinc-400 uppercase">{stat.label}</span>
                    <span className="text-[11px] font-black">{stat.value}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Reputation Sidebar (Compact) */}
          <div className="w-full sm:w-32 pt-3 sm:pt-0 sm:pl-6 sm:border-l border-dashed border-black/10">
            <div className="flex justify-between items-end mb-1">
              <span className="text-[8px] font-black uppercase text-zinc-400">Score</span>
              <span className="text-xs font-black">{reputation}%</span>
            </div>
            <div className="h-1.5 bg-zinc-100 rounded-full overflow-hidden border border-black/5">
              <div className="h-full bg-emerald-500" style={{ width: `${reputation}%` }}></div>
            </div>
            <button onClick={onLogout} className="w-full mt-3 bg-zinc-50 border border-black px-2 py-1 rounded-lg text-[8px] font-black uppercase hover:bg-black hover:text-white transition-all">Sair 🚪</button>
          </div>
        </div>
      </div>

      {/* Tighter Tabs */}
      <div className="flex gap-1.5">
        <button 
          onClick={() => setActiveTab('activity')} 
          className={`px-4 py-1.5 rounded-xl border-2 border-black font-black uppercase text-[9px] transition-all ${activeTab === 'activity' ? 'bg-black text-yellow-400' : 'bg-white text-black hover:bg-zinc-50'}`}
        >
          📈 Atividade
        </button>
        <button 
          onClick={() => setActiveTab('settings')} 
          className={`px-4 py-1.5 rounded-xl border-2 border-black font-black uppercase text-[9px] transition-all ${activeTab === 'settings' ? 'bg-black text-yellow-400' : 'bg-white text-black hover:bg-zinc-50'}`}
        >
          ⚙️ Ajustes
        </button>
      </div>

      {/* Compact Content Area */}
      {activeTab === 'activity' ? (
        <div className="space-y-6 animate-in fade-in duration-200">
          <section>
            <h3 className="text-[11px] font-black uppercase italic tracking-tighter mb-2 border-b border-black/5 pb-1">🏆 Arrematados ({myBids.length})</h3>
            {myBids.length > 0 ? (
              <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-3">
                {myBids.map(a => <AuctionCard key={a.id} auction={a} onView={onViewAuction} />)}
              </div>
            ) : (
              <div className="py-6 text-center bg-zinc-50 rounded-xl border border-dashed border-black/10">
                <p className="text-[9px] font-bold uppercase text-zinc-400">Nenhum arremate.</p>
              </div>
            )}
          </section>

          <section>
            <h3 className="text-[11px] font-black uppercase italic tracking-tighter mb-2 border-b border-black/5 pb-1">🔨 Meus Desapegos ({mySales.length})</h3>
            {mySales.length > 0 ? (
              <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-3">
                {mySales.map(a => <AuctionCard key={a.id} auction={a} onView={onViewAuction} />)}
              </div>
            ) : (
              <div className="py-6 text-center bg-zinc-50 rounded-xl border border-dashed border-black/10">
                <p className="text-[9px] font-bold uppercase text-zinc-400">Nenhum anúncio.</p>
              </div>
            )}
          </section>
        </div>
      ) : (
        <div className="animate-in fade-in duration-200">
          <div className="bg-white border-2 border-black rounded-2xl p-5 shadow-[4px_4px_0px_0px_#000] max-w-md">
            <h3 className="text-xs font-black uppercase italic tracking-tighter mb-4">⚙️ Configurações</h3>
            <form onSubmit={handleUpdateNick} className="space-y-4">
              <div>
                <label className="block text-[8px] font-black uppercase mb-1 text-zinc-400">Mudar Apelido</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 font-black text-zinc-300">@</span>
                  <input 
                    type="text" 
                    value={newNick} 
                    onChange={(e) => setNewNick(e.target.value.toLowerCase().replace(/\s/g, '_'))} 
                    className="w-full bg-zinc-50 border border-black p-2 pl-7 rounded-lg font-black uppercase text-[10px] outline-none focus:ring-2 ring-yellow-400 transition-all" 
                  />
                </div>
              </div>
              
              <button type="submit" className="w-full py-2 rounded-lg font-black text-[10px] uppercase border border-black bg-yellow-400 text-black shadow-[2px_2px_0px_0px_#000] active:translate-y-0.5 active:shadow-none transition-all">
                Salvar Tudo 🔨
              </button>
              {saveStatus && <p className="text-center text-[8px] font-black uppercase text-emerald-600">{saveStatus}</p>}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
