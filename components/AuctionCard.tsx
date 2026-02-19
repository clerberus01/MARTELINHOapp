
import React, { useState, useEffect } from 'react';
import { AuctionItem } from '../types';

interface AuctionCardProps {
  auction: AuctionItem;
  onView: (id: string) => void;
}

const AuctionCard: React.FC<AuctionCardProps> = ({ auction, onView }) => {
  const [timeLeft, setTimeLeft] = useState<string>('');
  const [isEndingSoon, setIsEndingSoon] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = Date.now();
      const diff = auction.endTime - now;
      if (diff <= 0) {
        setTimeLeft('FIM');
        setIsEndingSoon(false);
        clearInterval(timer);
      } else {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        setIsEndingSoon(diff < 1000 * 60 * 60 * 12);
        
        if (diff < 1000 * 60 * 60) {
          setTimeLeft(`${mins}m`);
        } else if (diff < 1000 * 60 * 60 * 24) {
          setTimeLeft(`${hours}h`);
        } else {
          setTimeLeft(`${Math.floor(diff / (1000 * 60 * 60 * 24))}d`);
        }
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [auction.endTime]);

  return (
    <div 
      className="group bg-white border border-black/10 hover:border-black transition-all flex flex-col h-full cursor-pointer rounded-xl overflow-hidden shadow-sm hover:shadow-md"
      onClick={() => onView(auction.id)}
    >
      <div className="relative aspect-square overflow-hidden bg-zinc-50 border-b border-black/5">
        <img 
          src={auction.imageUrl} 
          alt={auction.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        
        <div className={`absolute top-2 right-2 px-2 py-0.5 text-[8px] font-black border border-black/20 rounded shadow-sm ${isEndingSoon ? 'bg-red-600 text-white animate-pulse' : 'bg-yellow-400 text-black'}`}>
          {timeLeft}
        </div>
      </div>

      <div className="p-3 flex flex-col justify-between flex-grow gap-2">
        <h3 className="text-[10px] sm:text-xs font-black text-black line-clamp-2 uppercase leading-tight tracking-tight">
          {auction.title}
        </h3>
        <div className="flex items-end justify-between border-t border-black/5 pt-2">
           <div className="flex flex-col">
             <span className="text-[7px] font-black text-zinc-400 uppercase leading-none mb-0.5">Lance Atual</span>
             <span className="text-xs sm:text-sm font-black text-black leading-none">R${auction.currentBid.toLocaleString('pt-BR')}</span>
           </div>
           <span className="text-[8px] font-bold text-zinc-400 uppercase bg-zinc-50 px-1.5 py-0.5 rounded border border-black/5">🔨 {auction.bidCount}</span>
        </div>
      </div>
    </div>
  );
};

export default AuctionCard;
