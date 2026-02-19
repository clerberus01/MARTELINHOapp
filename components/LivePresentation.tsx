
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

  useEffect(() => {
    const interval = setInterval(() => {
      setViewerCount(prev => prev + (Math.floor(Math.random() * 5) - 2));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-[300] bg-black text-white flex flex-col font-black overflow-hidden select-none">
      {/* Header Overlay */}
      <div className="bg-yellow-400 text-black p-4 sm:p-8 flex justify-between items-center border-b-4 sm:border-b-[12px] border-black shadow-lg">
        <div className="flex items-center gap-3 sm:gap-6">
          <div className="bg-red-600 text-white px-3 sm:px-8 py-1.5 sm:py-3 rounded-full flex items-center gap-1.5 sm:gap-3 animate-pulse border-2 sm:border-4 border-black">
            <span className="text-sm sm:text-3xl">🔴</span>
            <span className="text-xs sm:text-2xl tracking-tighter">AO VIVO</span>
          </div>
          <div className="hidden sm:block">
            <h1 className="text-2xl sm:text-5xl uppercase italic tracking-tighter leading-none">MARTELINHO STUDIO</h1>
            <p className="text-[8px] sm:text-sm font-bold uppercase opacity-60">@martelinho_leiloes</p>
          </div>
        </div>
        <button onClick={onClose} className="bg-black text-white w-10 h-10 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl text-xl sm:text-4xl border-2 sm:border-4 border-white hover:bg-zinc-800 transition-all">✕</button>
      </div>

      <div className="flex-grow grid grid-cols-1 lg:grid-cols-12 overflow-y-auto lg:overflow-hidden pb-20 lg:pb-0">
        {/* Lado Esquerdo: Produto */}
        <div className="lg:col-span-8 p-6 sm:p-12 flex flex-col justify-center gap-4 sm:gap-8">
          <div className="relative border-8 sm:border-[16px] border-yellow-400 rounded-[40px] sm:rounded-[80px] overflow-hidden shadow-2xl bg-zinc-900 group">
            <img src={auction.imageUrl} className="w-full h-auto object-contain max-h-[40vh] sm:max-h-[60vh] mx-auto" alt={auction.title} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
            <div className="absolute bottom-6 left-6 right-6 sm:bottom-12 sm:left-12 sm:right-12">
               <h2 className="text-2xl sm:text-7xl text-yellow-400 uppercase italic tracking-tighter leading-none mb-2 sm:mb-4 drop-shadow-lg">{auction.title}</h2>
               <div className="flex gap-2">
                  <span className="bg-white text-black px-3 py-1 sm:px-6 sm:py-2 rounded-lg sm:rounded-xl text-[10px] sm:text-xl">DE @{auction.sellerName.toUpperCase()}</span>
                  <span className="bg-yellow-400 text-black px-3 py-1 sm:px-6 sm:py-2 rounded-lg sm:rounded-xl text-[10px] sm:text-xl">TOP</span>
               </div>
            </div>
          </div>
          
          {/* Teleprompter */}
          <div className="bg-zinc-900/80 backdrop-blur-xl border-2 sm:border-4 border-zinc-700 p-4 sm:p-8 rounded-3xl sm:rounded-[40px] shadow-2xl">
            <div className="flex items-center gap-2 mb-2 sm:mb-4">
              <span className="text-yellow-400 text-xs sm:text-base">🤖</span>
              <p className="text-[8px] sm:text-xs text-zinc-500 uppercase tracking-widest">Script IA:</p>
            </div>
            {loadingScript ? (
              <p className="text-lg sm:text-3xl animate-pulse text-zinc-600 italic">Analisando...</p>
            ) : (
              <p className="text-base sm:text-4xl text-yellow-50 italic leading-tight">"{script}"</p>
            )}
          </div>
        </div>

        {/* Lado Direito: Dados */}
        <div className="lg:col-span-4 bg-zinc-900 border-t-4 lg:border-t-0 lg:border-l-[12px] border-black p-6 sm:p-12 flex flex-col justify-between">
          <div className="space-y-8 sm:space-y-16">
            <div className="text-center space-y-2 sm:space-y-4">
              <p className="text-zinc-500 uppercase text-xs sm:text-xl tracking-widest italic">OFERTA ATUAL</p>
              <div className="relative inline-block">
                <p className="text-[4rem] sm:text-[10rem] lg:text-[12rem] text-yellow-400 tracking-tighter leading-[0.8] drop-shadow-xl">
                  {auction.currentBid}
                </p>
                <span className="absolute -top-2 -left-6 sm:-top-4 sm:-left-12 text-lg sm:text-5xl text-yellow-400/50">R$</span>
              </div>
              
              <div className="mt-4 sm:mt-8 bg-white text-black py-3 sm:py-6 px-5 sm:px-10 rounded-2xl sm:rounded-[30px] inline-block border-4 sm:border-8 border-black rotate-[-3deg] shadow-xl animate-bounce">
                <p className="text-sm sm:text-4xl uppercase italic tracking-tighter leading-none">
                   {auction.winnerName ? `@${auction.winnerName.toUpperCase()} LIDERANDO!` : 'QUEM DÁ MAIS?'}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-zinc-500 uppercase text-[10px] sm:text-sm tracking-widest">Últimos Lances</p>
              <div className="space-y-2">
                {auction.bids?.slice(0, 3).map((bid, idx) => (
                  <div key={bid.id} className={`flex justify-between items-center p-3 sm:p-5 rounded-xl border-2 sm:border-4 transition-all ${idx === 0 ? 'bg-yellow-400/10 border-yellow-400' : 'bg-black/50 border-white/5 opacity-50'}`}>
                    <span className={`text-xs sm:text-2xl italic ${idx === 0 ? 'text-yellow-400' : 'text-zinc-400'}`}>@{bid.bidderName}</span>
                    <span className="text-base sm:text-3xl font-black">R$ {bid.amount}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 space-y-4">
            <div className="flex items-center justify-center gap-4 bg-red-600/10 p-4 sm:p-8 rounded-3xl sm:rounded-[40px] border-2 sm:border-4 border-red-600/30">
              <span className="text-2xl sm:text-5xl">👥</span>
              <p className="text-lg sm:text-3xl font-black text-red-500 uppercase italic tracking-tighter">{viewerCount} AO VIVO</p>
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
