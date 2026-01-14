
import React, { useState, useEffect } from 'react';
import { AuctionItem, AuctionStatus } from '../types';
import { generateAuctionUpdate } from '../services/geminiService';

interface AuctionDetailProps {
  auction: AuctionItem;
  userHasItems: boolean;
  onPlaceBid: (auctionId: string, amount: number) => void;
  onOfferSwap: (auctionId: string) => void;
  onConfirmDelivery: (auctionId: string) => void;
  onCancelAuction: (auctionId: string) => void;
  onBack: () => void;
  onWithdraw: (auctionId: string) => void;
  onCreateItem: () => void;
}

const AuctionDetail: React.FC<AuctionDetailProps> = ({ 
  auction, onPlaceBid, onConfirmDelivery, onCancelAuction, onBack 
}) => {
  const [bidAmount, setBidAmount] = useState<string>('');
  const [aiMessage, setAiMessage] = useState<string>('');
  const [timeLeft, setTimeLeft] = useState<string>('');

  const isSeller = auction.sellerId === 'me';
  const canCancel = isSeller && auction.bidCount === 0 && auction.status === AuctionStatus.ACTIVE;

  useEffect(() => {
    const timer = setInterval(() => {
      const diff = auction.endTime - Date.now();
      if (diff <= 0) {
        setTimeLeft('DISPUTA ENCERRADA');
        clearInterval(timer);
      } else {
        const h = Math.floor(diff / (1000 * 60 * 60));
        const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeLeft(`${h}h ${m}m ${s}s`);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [auction.endTime]);

  useEffect(() => {
    if (auction.status === AuctionStatus.ACTIVE) {
      const fetchAiMessage = async () => {
        try {
          const msg = await generateAuctionUpdate(auction.title, auction.currentBid);
          setAiMessage(msg || '');
        } catch (err) { console.error(err); }
      };
      fetchAiMessage();
    }
  }, [auction.id, auction.currentBid, auction.status]);

  const handleBid = (e?: React.FormEvent) => {
    e?.preventDefault();
    const amount = Number(bidAmount);
    if (amount <= auction.currentBid) {
      alert("Seu lance deve cobrir o valor atual!");
      return;
    }
    onPlaceBid(auction.id, amount);
    setBidAmount('');
  };

  const suggestedCover = Math.ceil(auction.currentBid * 1.05);

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20 px-4">
      <div className="flex justify-between items-center">
        <button onClick={onBack} className="bg-black text-white px-6 py-3 rounded-xl font-black text-xs uppercase border-4 border-black">← Voltar</button>
        {canCancel && <button onClick={() => onCancelAuction(auction.id)} className="bg-red-500 text-white px-4 py-3 rounded-xl font-black text-xs uppercase border-4 border-black">Remover Oferta</button>}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="space-y-6">
          <div className="bg-white p-3 border-8 border-black rounded-[40px] shadow-[15px_15px_0px_0px_rgba(0,0,0,1)] relative">
            <img src={auction.imageUrl} className="w-full h-auto rounded-[30px]" />
            <div className="absolute top-8 right-8 bg-black text-yellow-400 px-6 py-3 rounded-2xl border-4 border-yellow-400 font-black italic">{timeLeft}</div>
          </div>
          
          <div className="bg-white p-8 border-4 border-black rounded-[40px] shadow-xl">
            <h1 className="text-4xl font-black uppercase italic tracking-tighter mb-4">{auction.title}</h1>
            <p className="text-zinc-600 font-bold mb-6">{auction.description}</p>
            <div className="p-4 bg-zinc-50 rounded-2xl border-2 border-black/5 flex items-center gap-4">
               <div className="w-10 h-10 rounded-full bg-yellow-400 border-2 border-black flex items-center justify-center font-black">?</div>
               <p className="text-xs font-black uppercase">Ofertante: @{auction.sellerName}</p>
            </div>
            {auction.status === AuctionStatus.PAID_PENDING_DELIVERY && (
              <div className="mt-6 bg-emerald-50 border-4 border-emerald-500 p-6 rounded-3xl text-center">
                <p className="font-black uppercase text-emerald-800 text-xl mb-4">✨ NEGÓCIO FECHADO ✨</p>
                <button onClick={() => onConfirmDelivery(auction.id)} className="bg-emerald-600 text-white px-8 py-4 rounded-xl font-black uppercase border-4 border-black">Confirmar Recebimento</button>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-yellow-400 border-8 border-black p-10 rounded-[50px] shadow-[20px_20px_0px_0px_rgba(0,0,0,1)] text-center">
            <p className="text-black/40 font-black text-xs uppercase mb-2">Melhor Oferta Atual</p>
            <p className="text-8xl font-black tracking-tighter mb-10 leading-none">R$ {auction.currentBid}</p>
            
            {auction.status === AuctionStatus.ACTIVE ? (
              <form onSubmit={handleBid} className="space-y-4">
                <input 
                  type="number" required
                  className="w-full bg-white text-black font-black text-4xl py-8 px-6 rounded-3xl border-8 border-black outline-none"
                  value={bidAmount}
                  onChange={e => setBidAmount(e.target.value)}
                  placeholder={suggestedCover.toString()}
                />
                <button type="submit" className="w-full bg-black text-yellow-400 font-black text-3xl py-8 rounded-[30px] uppercase shadow-[0_10px_0px_0px_rgba(0,0,0,1)]">ENVIAR LANCE! 🔨</button>
              </form>
            ) : (
              <div className="bg-black text-white p-10 rounded-[40px] border-8 border-yellow-500">
                <p className="text-4xl font-black uppercase italic">VENDIDO! 🤝</p>
              </div>
            )}
          </div>
          {aiMessage && auction.status === AuctionStatus.ACTIVE && (
            <div className="bg-black text-white p-8 rounded-[40px] border-8 border-yellow-400 italic">
              <p className="text-[10px] uppercase text-yellow-400 font-black mb-2">Aviso do Mediador:</p>
              <p className="text-2xl font-black">"{aiMessage}"</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuctionDetail;
