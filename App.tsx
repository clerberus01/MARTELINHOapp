
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import AdCard from './components/AdCard';
import AdDetail from './components/AdDetail';
import ListingForm from './components/ListingForm';
import AdminDashboard from './components/AdminDashboard';
import LivePresentation from './components/LivePresentation';
import Auth from './components/Auth';
import UserProfile from './components/UserProfile';
import InfoPages from './components/InfoPages'; // Import novo
import { AdItem, AdStatus, User, Bid, SwapOffer, Message } from './types';
import { INITIAL_ADS, CATEGORIES } from './constants';

type PageType = 'home' | 'create' | 'detail' | 'admin' | 'live' | 'profile' | 'how-it-works' | 'fees' | 'lgpd';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<PageType>('home');
  const [selectedAdId, setSelectedAdId] = useState<string | null>(null);
  const [ads, setAds] = useState<AdItem[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('martelinho_user');
    if (savedUser) setUser(JSON.parse(savedUser));

    const savedAds = localStorage.getItem('martelinho_ads');
    if (savedAds) {
      setAds(JSON.parse(savedAds));
    } else {
      setAds(INITIAL_ADS as any);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (ads.length > 0) {
      localStorage.setItem('martelinho_ads', JSON.stringify(ads));
    }
  }, [ads]);

  const handleLogin = (userData: User) => {
    const adminUser = { ...userData, isAdmin: userData.name.toLowerCase().includes('admin') };
    setUser(adminUser);
    localStorage.setItem('martelinho_user', JSON.stringify(adminUser));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('martelinho_user');
    setCurrentPage('home');
    setSelectedAdId(null);
  };

  const handlePlaceBid = (adId: string, amount: number) => {
    if (!user) return;
    if (user.balance < amount) return alert("Saldo insuficiente!");
    const newBid: Bid = {
      id: Math.random().toString(36).substr(2, 5),
      bidderName: user.name,
      amount: amount,
      timestamp: Date.now()
    };
    setAds(prev => prev.map(a => 
      a.id === adId ? { ...a, currentBid: amount, bidCount: a.bidCount + 1, bids: [newBid, ...(a.bids || [])] } : a
    ));
    alert("🔨 LANCE REGISTRADO!");
  };

  const handleProposeSwap = (adId: string, offeredItemId: string) => {
    if (!user) return;
    const ad = ads.find(a => a.id === adId);
    const offeredItem = ads.find(a => a.id === offeredItemId);
    
    if (!ad || !offeredItem) return;

    const userCity = user.address.toLowerCase().split(',')[0].trim();
    const adCity = ad.location.toLowerCase().split(',')[0].trim();

    if (userCity !== adCity) {
      alert(`⚠️ SEGURANÇA: Trocas são permitidas apenas na mesma cidade (${adCity}) para entrega presencial.`);
      return;
    }

    const newOffer: SwapOffer = {
      id: Math.random().toString(36).substr(2, 9),
      proposerId: user.id,
      proposerName: user.name,
      offeredItemId: offeredItemId,
      offeredItemTitle: offeredItem.title,
      offeredItemPrice: offeredItem.currentBid,
      status: 'pending',
      timestamp: Date.now()
    };

    setAds(prev => prev.map(a => 
      a.id === adId 
        ? { ...a, swapOffers: [newOffer, ...(a.swapOffers || [])] } 
        : a
    ));
    alert("🚀 PROPOSTA DE TROCA ENVIADA!");
  };

  const handleAcceptSwap = (adId: string, offerId: string) => {
    setAds(prev => prev.map(a => {
      if (a.id === adId) {
        return {
          ...a,
          status: AdStatus.SWAP_ACCEPTED,
          swapOffers: a.swapOffers?.map(o => 
            o.id === offerId ? { ...o, status: 'accepted' } : o
          )
        };
      }
      return a;
    }));
    alert("✅ TROCA ACEITA!");
  };

  const handlePaySwapFee = (adId: string) => {
    if (!user) return;
    const ad = ads.find(a => a.id === adId);
    if (!ad) return;
    
    const acceptedOffer = ad.swapOffers?.find(o => o.status === 'accepted');
    if (!acceptedOffer) return;

    const higherValue = Math.max(ad.currentBid, acceptedOffer.offeredItemPrice);
    const fee = higherValue * 0.05;

    if (user.balance < fee) return alert("Saldo insuficiente!");

    const confirmPay = confirm(`Pagar taxa de R$ ${fee.toLocaleString('pt-BR')}?`);
    if (confirmPay) {
      setUser({ ...user, balance: user.balance - fee });
      setAds(prev => prev.map(a => {
        if (a.id === adId) {
          return {
            ...a,
            status: AdStatus.SWAP_IN_PROGRESS,
            swapOffers: a.swapOffers?.map(o => o.status === 'accepted' ? { ...o, status: 'paid' } : o)
          };
        }
        return a;
      }));
    }
  };

  const handleSendMessage = (adId: string, text: string) => {
    if (!user) return;
    const newMessage: Message = {
      id: Math.random().toString(36).substr(2, 9),
      senderId: user.id,
      text,
      timestamp: Date.now()
    };
    setAds(prev => prev.map(a => 
      a.id === adId ? { ...a, chatMessages: [...(a.chatMessages || []), newMessage] } : a
    ));
  };

  if (loading) return <div className="h-screen bg-white flex items-center justify-center font-black uppercase italic text-3xl text-black">Martelinho...</div>;
  if (!user) return <Auth onLogin={handleLogin} />;

  const selectedAd = ads.find(a => a.id === selectedAdId);
  const userHasItems = ads.some(a => (a.sellerId === 'me' || a.sellerId === user.id) && a.status === AdStatus.ACTIVE);

  const filteredAds = ads.filter(a => {
    const titleMatch = a.title.toLowerCase().includes(searchQuery.toLowerCase());
    const categoryMatch = !selectedCategory || a.category === selectedCategory;
    const activeMatch = a.status === AdStatus.ACTIVE;
    return titleMatch && categoryMatch && activeMatch;
  });

  return (
    <Layout 
      user={user} 
      onNavigate={(page) => { setCurrentPage(page as any); setSelectedAdId(null); }} 
      currentPage={currentPage}
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
    >
      {currentPage === 'home' && (
        <div className="flex flex-col md:flex-row gap-6">
          <aside className="hidden md:block w-56 shrink-0">
            <div className="sticky top-24 space-y-4">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Categorias</h3>
              <div className="flex flex-col gap-1">
                <button 
                  onClick={() => setSelectedCategory(null)} 
                  className={`text-left px-4 py-2 text-[10px] font-black uppercase rounded-xl transition-all ${!selectedCategory ? 'bg-black text-yellow-400 shadow-[3px_3px_0px_0px_#FACC15]' : 'text-zinc-600 hover:bg-zinc-100'}`}
                >
                  📦 Ver Tudo
                </button>
                {CATEGORIES.map(cat => (
                  <button 
                    key={cat.id} 
                    onClick={() => setSelectedCategory(cat.name)} 
                    className={`text-left px-4 py-2 text-[10px] font-black uppercase rounded-xl transition-all flex items-center gap-3 ${selectedCategory === cat.name ? 'bg-black text-yellow-400 shadow-[3px_3px_0px_0px_#FACC15]' : 'text-zinc-600 hover:bg-zinc-100'}`}
                  >
                    <span className="text-sm">{cat.icon}</span>
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          <div className="flex-grow">
            <div className="md:hidden overflow-x-auto pb-4 mb-2 flex gap-2 custom-scrollbar">
              <button 
                onClick={() => setSelectedCategory(null)} 
                className={`shrink-0 px-4 py-2 text-[10px] font-black uppercase rounded-xl border-2 border-black transition-all ${!selectedCategory ? 'bg-black text-yellow-400 shadow-[2px_2px_0px_0px_#FACC15]' : 'bg-white text-zinc-600'}`}
              >
                📦 Tudo
              </button>
              {CATEGORIES.map(cat => (
                <button 
                  key={cat.id} 
                  onClick={() => setSelectedCategory(cat.name)} 
                  className={`shrink-0 px-4 py-2 text-[10px] font-black uppercase rounded-xl border-2 border-black transition-all flex items-center gap-2 ${selectedCategory === cat.name ? 'bg-black text-yellow-400 shadow-[2px_2px_0px_0px_#FACC15]' : 'bg-white text-zinc-600'}`}
                >
                  <span>{cat.icon}</span>
                  {cat.name}
                </button>
              ))}
            </div>

            {filteredAds.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
                {filteredAds.map(a => (
                  <AdCard 
                    key={a.id} 
                    ad={a} 
                    onView={(id) => { setSelectedAdId(id); setCurrentPage('detail'); }} 
                  />
                ))}
              </div>
            ) : (
              <div className="bg-zinc-50 border-2 border-dashed border-black/5 py-16 text-center rounded-3xl">
                <p className="text-xs font-black uppercase text-zinc-300 italic">Nenhum desapego aqui no momento.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {currentPage === 'detail' && selectedAd && (
        <AdDetail 
          ad={selectedAd} 
          user={user}
          userHasItems={userHasItems}
          userItems={ads.filter(a => (a.sellerId === 'me' || a.sellerId === user.id) && a.status === AdStatus.ACTIVE)}
          onBack={() => setCurrentPage('home')}
          onPlaceBid={handlePlaceBid}
          onProposeSwap={handleProposeSwap}
          onAcceptSwap={handleAcceptSwap}
          onPaySwapFee={handlePaySwapFee}
          onSendMessage={handleSendMessage}
        />
      )}

      {currentPage === 'create' && (
        <ListingForm 
          onSuccess={(item) => { 
            const finalItem = { ...item, sellerId: user.id, sellerName: user.name };
            setAds([finalItem, ...ads]); 
            setCurrentPage('home'); 
          }} 
          onCancel={() => setCurrentPage('home')} 
        />
      )}

      {currentPage === 'profile' && (
        <UserProfile 
          user={user} 
          ads={ads} 
          onUpdateUser={(u) => {
            setUser(u);
            localStorage.setItem('martelinho_user', JSON.stringify(u));
          }} 
          onLogout={handleLogout} 
          onViewAd={(id) => { setSelectedAdId(id); setCurrentPage('detail'); }} 
          onBack={() => setCurrentPage('home')} 
          onNavigate={(page) => setCurrentPage(page as any)}
        />
      )}

      {(currentPage === 'how-it-works' || currentPage === 'fees' || currentPage === 'lgpd') && (
        <InfoPages 
          view={currentPage as any} 
          onBack={() => setCurrentPage('home')} 
        />
      )}
    </Layout>
  );
};

export default App;
