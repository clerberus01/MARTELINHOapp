
import React, { useState, useEffect } from 'react';
import { AuctionItem, AuctionStatus, User, Message } from '../types';

interface AuctionDetailProps {
  auction: AuctionItem;
  user: User;
  userHasItems: boolean;
  userItems: AuctionItem[];
  onPlaceBid: (auctionId: string, amount: number) => void;
  onProposeSwap: (auctionId: string, offeredItemId: string) => void;
  onAcceptSwap: (auctionId: string, offerId: string) => void;
  onPaySwapFee: (auctionId: string) => void;
  onSendMessage: (auctionId: string, text: string) => void;
  onBack: () => void;
}

const AuctionDetail: React.FC<AuctionDetailProps> = ({ 
  auction, user, userHasItems, userItems, onPlaceBid, onProposeSwap, onAcceptSwap, onPaySwapFee, onSendMessage, onBack 
}) => {
  const [bidAmount, setBidAmount] = useState<string>('');
  const [timeLeft, setTimeLeft] = useState<string>('');
  const [showSwapModal, setShowSwapModal] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const isSeller = auction.sellerId === 'me' || auction.sellerId === user.id;
  const isSwapParticipant = isSeller || auction.swapOffers?.some(o => o.proposerId === user.id && o.status === 'paid');
  const chatEnabled = auction.status === AuctionStatus.SWAP_IN_PROGRESS && isSwapParticipant;

  const auctionCity = auction.location.toLowerCase().split(',')[0].trim();
  const productImages = auction.imageUrls || [auction.imageUrl];

  useEffect(() => {
    const timer = setInterval(() => {
      const diff = auction.endTime - Date.now();
      if (diff <= 0) {
        setTimeLeft('FIM');
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

  const handleBid = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = Number(bidAmount);
    if (amount <= auction.currentBid) return alert("Cubra o lance atual!");
    onPlaceBid(auction.id, amount);
    setBidAmount('');
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    onSendMessage(auction.id, chatInput);
    setChatInput('');
  };

  return (
    <div className="max-w-4xl mx-auto pb-10 px-2 sm:px-4">
      <div className="flex items-center gap-2 mb-4">
        <button onClick={onBack} className="text-[9px] font-black uppercase text-zinc-400 hover:text-black">← Voltar</button>
        <span className="text-zinc-200">/</span>
        <span className="text-[9px] font-bold text-zinc-300 uppercase">{auction.category}</span>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Left Side: Images & Info */}
        <div className="md:w-3/5 space-y-4">
          <div className="bg-zinc-50 border-2 border-black rounded-xl overflow-hidden relative max-h-[250px] aspect-video flex items-center justify-center">
            <img 
              src={productImages[activeImageIndex]} 
              className="max-w-full max-h-full object-contain" 
              alt={auction.title} 
            />
            <div className="absolute top-2 left-2 bg-black text-yellow-400 px-2 py-0.5 text-[8px] font-black uppercase italic rounded">
              {timeLeft}
            </div>
          </div>
          
          {productImages.length > 1 && (
            <div className="flex gap-1 overflow-x-auto pb-1 custom-scrollbar">
              {productImages.map((img, idx) => (
                <button 
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`shrink-0 w-12 h-12 border rounded overflow-hidden ${activeImageIndex === idx ? 'border-yellow-400 border-2' : 'border-black/5 opacity-60'}`}
                >
                  <img src={img} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          <div className="space-y-2">
            <h1 className="text-xl font-black uppercase italic tracking-tighter leading-none">{auction.title}</h1>
            <p className="text-[10px] font-medium text-zinc-500 line-clamp-2 uppercase leading-tight">{auction.description}</p>
            
            <div className="flex gap-4 border-t border-black/5 pt-2">
              <div className="flex-1">
                <p className="text-[7px] font-black uppercase text-zinc-300">Local</p>
                <p className="text-[9px] font-black uppercase">📍 {auction.location}</p>
              </div>
              <div className="flex-1 text-right">
                <p className="text-[7px] font-black uppercase text-zinc-300">Vendedor</p>
                <p className="text-[9px] font-black uppercase">@{auction.sellerName}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Bidding & Swap */}
        <div className="md:w-2/5">
          <div className="bg-white border-2 border-black p-4 rounded-xl shadow-[4px_4px_0px_0px_#000] sticky top-24">
            <div className="mb-4">
              <p className="text-[8px] font-black uppercase text-zinc-300 mb-0.5">Lance Atual</p>
              <p className="text-3xl font-black tracking-tighter leading-none">R$ {auction.currentBid}</p>
              <p className="text-[7px] font-bold text-zinc-400 mt-1 uppercase italic">{auction.bidCount} lances registrados</p>
            </div>

            {auction.status === AuctionStatus.ACTIVE ? (
              <form onSubmit={handleBid} className="space-y-2">
                <input 
                  type="number" required
                  className="w-full bg-zinc-50 border border-black p-3 rounded-lg font-black text-lg outline-none focus:ring-2 ring-yellow-400"
                  placeholder="R$"
                  value={bidAmount}
                  onChange={e => setBidAmount(e.target.value)}
                />
                <button type="submit" className="w-full bg-black text-yellow-400 font-black py-3 rounded-lg text-xs uppercase hover:bg-yellow-400 hover:text-black transition-all">Cobrir Lance 🔨</button>
                {auction.acceptsSwap && !isSeller && (
                  <button 
                    type="button"
                    onClick={() => userHasItems ? setShowSwapModal(true) : alert("Sem itens para trocar.")}
                    className="w-full bg-white text-black font-black py-2 rounded-lg text-[9px] uppercase border border-black hover:bg-zinc-50 transition-all mt-1"
                  >
                    Propor Troca 🔄
                  </button>
                )}
              </form>
            ) : (
              <div className="p-3 bg-zinc-50 text-center text-[9px] font-black uppercase italic text-zinc-400">Leilão Encerrado.</div>
            )}
          </div>
        </div>
      </div>

      {chatEnabled && (
        <div className="mt-6 bg-white border-2 border-black rounded-xl p-4 space-y-3 max-w-xl mx-auto shadow-sm">
          <h3 className="text-[10px] font-black uppercase italic border-b border-black/5 pb-1">Negociação Chat 💬</h3>
          <div className="h-40 overflow-y-auto space-y-1 bg-zinc-50/50 p-2 rounded-lg text-[10px] font-bold uppercase">
            {auction.chatMessages?.map((m) => (
              <div key={m.id} className={`flex ${m.senderId === user.id ? 'justify-end' : 'justify-start'}`}>
                <div className={`p-1.5 rounded-md ${m.senderId === user.id ? 'bg-black text-white' : 'bg-yellow-400 text-black border border-black/10'}`}>
                  {m.text}
                </div>
              </div>
            ))}
          </div>
          <form onSubmit={handleSendChat} className="flex gap-1">
            <input 
              type="text" value={chatInput} onChange={e => setChatInput(e.target.value)}
              placeholder="Falar com vendedor..."
              className="flex-grow bg-zinc-50 border border-black/20 p-2 rounded font-black uppercase text-[9px] outline-none"
            />
            <button type="submit" className="bg-black text-white px-3 py-1.5 rounded font-black uppercase text-[9px]">Ok</button>
          </form>
        </div>
      )}

      {showSwapModal && (
        <div className="fixed inset-0 z-[500] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border-4 border-black p-4 max-w-md w-full rounded-2xl shadow-2xl">
            <h3 className="text-sm font-black uppercase italic mb-3">Escolha para trocar:</h3>
            <div className="grid grid-cols-3 gap-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
              {userItems.map(item => (
                <div key={item.id} onClick={() => { onProposeSwap(auction.id, item.id); setShowSwapModal(false); }} className="cursor-pointer border border-black/10 p-1 hover:bg-yellow-100 transition-all rounded">
                  <img src={item.imageUrl} className="w-full aspect-square object-cover rounded mb-1" />
                  <p className="text-[7px] font-black uppercase truncate">{item.title}</p>
                </div>
              ))}
            </div>
            <button onClick={() => setShowSwapModal(false)} className="mt-4 w-full bg-zinc-100 text-[10px] font-black uppercase py-2 rounded">Cancelar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuctionDetail;
