
import React, { useState, useEffect } from 'react';
import { AuctionItem } from '../types';

interface AuctionCardProps {
  auction: AuctionItem;
  onView: (id: string) => void;
  onOfferSwap?: (id: string) => void;
}

const AuctionCard: React.FC<AuctionCardProps> = ({ auction, onView, onOfferSwap }) => {
  const [timeLeft, setTimeLeft] = useState<string>('');
  const [isEndingSoon, setIsEndingSoon] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = Date.now();
      const diff = auction.endTime - now;
      if (diff <= 0) {
        setTimeLeft('ENCERRADO');
        setIsEndingSoon(false);
        clearInterval(timer);
      } else {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const secs = Math.floor((diff % (1000 * 60)) / 1000);
        
        // Se falta menos de 24 horas, considera "acabando hoje"
        setIsEndingSoon(diff < 1000 * 60 * 60 * 24);
        
        if (diff < 1000 * 60 * 60) { // Menos de 1 hora
          setTimeLeft(`${mins}m ${secs}s`);
        } else {
          setTimeLeft(`${hours}h ${mins}m`);
        }
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [auction.endTime]);

  const handleSwapClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onOfferSwap) onOfferSwap(auction.id);
  };

  return (
    <div 
      className={`group bg-white rounded-xl border-4 transition-all duration-200 cursor-pointer shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col h-full overflow-hidden ${isEndingSoon ? 'border-red-600 animate-[pulse_2s_infinite]' : 'border-black hover:translate-y-[-4px]'}`}
      onClick={() => onView(auction.id)}
    >
      <div className="relative aspect-video overflow-hidden border-b-4 border-black">
        <img 
          src={auction.imageUrl} 
          alt={auction.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        <div className="absolute top-2 right-2 flex flex-col gap-1 items-end">
          <div className="bg-yellow-400 border-2 border-black px-2 py-1 rounded text-[10px] font-black uppercase shadow-sm">
            {auction.category}
          </div>
          {auction.isLiveFeatured && (
            <div className="bg-black text-white border-2 border-yellow-400 px-2 py-1 rounded text-[9px] font-black uppercase flex items-center gap-1 animate-bounce">
              <span className="text-red-500">🔴</span> NA LIVE
            </div>
          )}
        </div>

        {isEndingSoon && (
          <div className="absolute top-2 left-2">
            <div className="bg-red-600 text-white border-2 border-black px-2 py-1 rounded text-[10px] font-black uppercase shadow-sm">
              🔥 ACABA HOJE!
            </div>
          </div>
        )}

        {auction.acceptsSwap && (
          <div className="absolute bottom-10 left-2">
            <div className="bg-emerald-500 text-white border-2 border-black px-2 py-1 rounded text-[10px] font-black uppercase shadow-sm flex items-center gap-1">
              <span>🤝</span> ACEITA TROCA
            </div>
          </div>
        )}

        <div className={`absolute bottom-0 left-0 right-0 py-1 px-3 flex justify-between items-center ${isEndingSoon ? 'bg-red-600 text-white' : 'bg-black text-yellow-400'}`}>
          <span className="text-[10px] font-black uppercase tracking-tighter">{isEndingSoon ? 'CORRE! RESTAM:' : 'Faltam:'}</span>
          <span className="text-xs font-black">{timeLeft}</span>
        </div>
      </div>

      <div className="p-4 flex-grow flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-black text-black leading-tight line-clamp-1 uppercase italic tracking-tighter">{auction.title}</h3>
        </div>
        
        <div className="flex items-center gap-1 text-[10px] font-black text-black/50 uppercase mb-3">
          <span className="text-sm">📍</span> {auction.location}
        </div>

        <div className="mt-auto space-y-2">
          <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase">
             <span>Min: R$ {auction.startingBid}</span>
             <span className="bg-slate-100 px-1.5 py-0.5 rounded border border-black/5">{auction.bidCount} lances</span>
          </div>
          
          <div className={`p-2 rounded-lg border-2 border-black flex flex-col gap-2 transition-colors ${isEndingSoon ? 'bg-red-50' : 'bg-slate-900'}`}>
            <div className="flex justify-between items-center px-1">
              <div className="flex flex-col">
                <p className={`text-[8px] font-black uppercase ${isEndingSoon ? 'text-red-800/60' : 'text-white/50'}`}>Lance Atual</p>
                <div className="flex items-baseline gap-1">
                  <p className={`text-lg font-black ${isEndingSoon ? 'text-red-700' : 'text-yellow-400'}`}>R$ {auction.currentBid.toLocaleString('pt-BR')}</p>
                </div>
                {auction.winnerName && (
                  <p className={`text-[9px] font-black uppercase truncate max-w-[100px] ${isEndingSoon ? 'text-red-900' : 'text-white'}`}>
                    Líder: @{auction.winnerName}
                  </p>
                )}
              </div>
              <button className={`${isEndingSoon ? 'bg-red-600 text-white' : 'bg-yellow-400 text-black'} text-[9px] font-black px-2 py-1 rounded uppercase border-2 border-black hover:bg-white hover:text-black transition-all`}>
                 CUBRIR
              </button>
            </div>
            
            {auction.acceptsSwap && (
              <button 
                onClick={handleSwapClick}
                className={`w-full text-[9px] font-black py-1.5 rounded uppercase border-2 border-black transition-all flex items-center justify-center gap-1 ${isEndingSoon ? 'bg-emerald-600 text-white' : 'bg-emerald-500 text-white hover:bg-emerald-400'}`}
              >
                🤝 OFERECER TROCA
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuctionCard;
