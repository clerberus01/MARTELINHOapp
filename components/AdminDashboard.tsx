
import React from 'react';
import { AdItem } from '../types';

interface AdminDashboardProps {
  ads: AdItem[];
  onStartLive: (adId: string) => void;
  onToggleLiveFeatured: (adId: string) => void;
  onBack: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ ads, onStartLive, onToggleLiveFeatured, onBack }) => {
  return (
    <div className="max-w-7xl mx-auto p-4 space-y-8 pb-20">
      <div className="flex justify-between items-center">
        <h2 className="text-4xl font-black uppercase italic tracking-tighter">Painel de Mediação 🎙️</h2>
        <button onClick={onBack} className="bg-black text-white px-6 py-2 rounded-xl font-black uppercase text-xs">Sair do Painel</button>
      </div>

      <div className="bg-white border-4 border-black rounded-[30px] overflow-hidden shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
        <table className="w-full text-left">
          <thead className="bg-yellow-400 border-b-4 border-black">
            <tr>
              <th className="p-4 font-black uppercase text-xs">Item em Disputa</th>
              <th className="p-4 font-black uppercase text-xs">Anunciante</th>
              <th className="p-4 font-black uppercase text-xs">Interessados</th>
              <th className="p-4 font-black uppercase text-xs">Oferta Atual</th>
              <th className="p-4 font-black uppercase text-xs">Em Destaque</th>
              <th className="p-4 font-black uppercase text-xs">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y-4 divide-black">
            {ads.map(ad => (
              <tr key={ad.id} className="hover:bg-slate-50 transition-colors">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <img src={ad.imageUrl} className="w-12 h-12 rounded-lg border-2 border-black object-cover" />
                    <span className="font-bold text-sm uppercase">{ad.title}</span>
                  </div>
                </td>
                <td className="p-4 font-bold text-xs">@{ad.sellerName}</td>
                <td className="p-4 font-black">{ad.bidCount}</td>
                <td className="p-4 font-black text-emerald-600">R$ {ad.currentBid}</td>
                <td className="p-4">
                  <button 
                    onClick={() => onToggleLiveFeatured(ad.id)}
                    className={`px-3 py-1 rounded-full border-2 border-black text-[10px] font-black uppercase ${ad.isLiveFeatured ? 'bg-red-500 text-white' : 'bg-white text-black'}`}
                  >
                    {ad.isLiveFeatured ? 'Sim' : 'Não'}
                  </button>
                </td>
                <td className="p-4">
                  <button 
                    onClick={() => onStartLive(ad.id)}
                    className="bg-black text-yellow-400 px-4 py-2 rounded-lg font-black uppercase text-[10px] border-2 border-black"
                  >
                    📺 MEDIAR AO VIVO
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
