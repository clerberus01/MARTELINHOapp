
import React, { useState, useEffect } from 'react';
import { AuctionItem } from '../types';
import { generateLiveScript } from '../services/geminiService';

interface LivePresentationProps {
  auction: AuctionItem;
  onClose: () => void;
}

const LivePresentation: React.FC<LivePresentationProps> = ({ auction, onClose }) => {
  const [script, setScript] = useState<string>('');
  const [loadingScript, setLoadingScript] = useState(false);
  const [viewerCount, setViewerCount] = useState(Math.floor(Math.random() * 200) + 50);

  useEffect(() => {
    const fetchScript = async () => {
      setLoadingScript(true);
      try {
        const text = await generateLiveScript(auction.title, auction.currentBid, auction.description);
        setScript(text || '');
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingScript(false);
      }
    };
    fetchScript();
  }, [auction.id]);

  // Efeito de "Pessoas entrando"
  useEffect(() => {
    const interval = setInterval(() => {
      setViewerCount(prev => prev + (Math.floor(Math.random() * 5) - 2));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-[300] bg-black text-white flex flex-col font-black overflow-hidden select-none">
      {/* Header Overlay para OBS/Captura */}
      <div className="bg-yellow-400 text-black p-8 flex justify-between items-center border-b-[12px] border-black shadow-[0_10px_50px_rgba(250,204,21,0.3)]">
        <div className="flex items-center gap-6">
          <div className="bg-red-600 text-white px-8 py-3 rounded-full flex items-center gap-3 animate-pulse border-4 border-black">
            <span className="text-3xl">🔴</span>
            <span className="text-2xl tracking-tighter">AO VIVO</span>
          </div>
          <div>
            <h1 className="text-5xl uppercase italic tracking-tighter leading-none">MARTELINHO STUDIO</h1>
            <p className="text-sm font-bold uppercase opacity-60">Siga @martelinho_leiloes no TikTok</p>
          </div>
        </div>
        <button onClick={onClose} className="bg-black text-white w-16 h-16 rounded-2xl text-4xl border-4 border-white hover:bg-zinc-800 transition-all">✕</button>
      </div>

      <div className="flex-grow grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        {/* Lado Esquerdo: Produto em destaque gigante */}
        <div className="lg:col-span-8 p-12 flex flex-col justify-center gap-8 relative">
          <div className="relative border-[16px] border-yellow-400 rounded-[80px] overflow-hidden shadow-[40px_40px_0px_0px_rgba(250,204,21,0.2)] bg-zinc-900 group">
            <img src={auction.imageUrl} className="w-full h-auto object-contain max-h-[60vh] mx-auto" alt={auction.title} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
            <div className="absolute bottom-12 left-12 right-12">
               <h2 className="text-7xl text-yellow-400 uppercase italic tracking-tighter leading-none mb-4 drop-shadow-lg">{auction.title}</h2>
               <div className="flex gap-4">
                  <span className="bg-white text-black px-6 py-2 rounded-xl text-xl">DESAPEGO DE @{auction.sellerName.toUpperCase()}</span>
                  <span className="bg-yellow-400 text-black px-6 py-2 rounded-xl text-xl">CONDIÇÃO: IMPECÁVEL</span>
               </div>
            </div>
          </div>
          
          {/* Teleprompter do Apresentador */}
          <div className="bg-zinc-900/80 backdrop-blur-xl border-4 border-zinc-700 p-8 rounded-[40px] shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-yellow-400">🤖</span>
              <p className="text-xs text-zinc-500 uppercase tracking-[0.3em]">Sugestão de Fala (Script IA):</p>
            </div>
            {loadingScript ? (
              <p className="text-3xl animate-pulse text-zinc-600 italic">O Gemini está analisando o item para você...</p>
            ) : (
              <p className="text-4xl text-yellow-50 italic leading-tight">"{script}"</p>
            )}
          </div>
        </div>

        {/* Lado Direito: Dashboard de Dados Críticos (O que o povo quer ver) */}
        <div className="lg:col-span-4 bg-zinc-900 border-l-[12px] border-black p-12 flex flex-col justify-between shadow-[-50px_0_100px_rgba(0,0,0,0.5)]">
          <div className="space-y-16">
            <div className="text-center space-y-4">
              <p className="text-zinc-500 uppercase text-xl tracking-widest italic">OFERTA ATUAL</p>
              <div className="relative inline-block">
                <p className="text-[12rem] text-yellow-400 tracking-tighter leading-[0.8] drop-shadow-[0_20px_0px_rgba(0,0,0,1)]">
                  {auction.currentBid}
                </p>
                <span className="absolute -top-4 -left-12 text-5xl text-yellow-400/50">R$</span>
              </div>
              
              <div className="mt-8 bg-white text-black py-6 px-10 rounded-[30px] inline-block border-8 border-black rotate-[-3deg] shadow-2xl animate-bounce">
                <p className="text-4xl uppercase italic tracking-tighter">
                   {auction.winnerName ? `@${auction.winnerName.toUpperCase()} TÁ LEVANDO!` : 'QUEM DÁ MAIS?'}
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex justify-between items-end border-b-4 border-zinc-800 pb-2">
                <p className="text-zinc-500 uppercase text-sm tracking-widest">Últimos Lances</p>
                <p className="text-yellow-400 text-xs font-bold uppercase">{auction.bidCount} disputas</p>
              </div>
              <div className="space-y-3">
                {auction.bids?.slice(0, 4).map((bid, idx) => (
                  <div key={bid.id} className={`flex justify-between items-center p-5 rounded-2xl border-4 transition-all ${idx === 0 ? 'bg-yellow-400/10 border-yellow-400 scale-105' : 'bg-black/50 border-white/5 opacity-50'}`}>
                    <span className={`text-2xl italic ${idx === 0 ? 'text-yellow-400' : 'text-zinc-400'}`}>@{bid.bidderName}</span>
                    <span className="text-3xl font-black">R$ {bid.amount}</span>
                  </div>
                ))}
                {auction.bidCount === 0 && (
                  <div className="p-10 border-4 border-dashed border-zinc-800 rounded-[40px] text-center">
                    <p className="text-zinc-600 italic text-2xl">Aguardando o primeiro herói...</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-center gap-6 bg-red-600/10 p-8 rounded-[40px] border-4 border-red-600/30">
              <div className="relative">
                 <span className="text-5xl">👥</span>
                 <span className="absolute -top-2 -right-2 w-4 h-4 bg-green-500 rounded-full animate-ping"></span>
              </div>
              <p className="text-3xl font-black text-red-500 uppercase italic tracking-tighter">{viewerCount} NA LIVE</p>
            </div>
            
            <div className="bg-black p-8 rounded-[40px] border-4 border-zinc-800 text-center space-y-4">
              <p className="text-sm text-zinc-400 uppercase tracking-[0.2em] leading-tight">Link para lances na Bio do perfil</p>
              <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
                 <div className="h-full bg-yellow-400 animate-[loading_60s_linear_infinite]"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes loading {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  );
};

export default LivePresentation;
