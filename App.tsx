
import React, { useState, useEffect, useRef } from 'react';
import Layout from './components/Layout';
import AuctionCard from './components/AuctionCard';
import AuctionDetail from './components/AuctionDetail';
import ListingForm from './components/ListingForm';
import AdminDashboard from './components/AdminDashboard';
import LivePresentation from './components/LivePresentation';
import Auth from './components/Auth';
import UserProfile from './components/UserProfile';
import { AuctionItem, AuctionStatus, User, Bid } from './types';
import { INITIAL_AUCTIONS, PLATFORM_FEE_PERCENTAGE, CATEGORIES } from './constants';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<'home' | 'create' | 'detail' | 'admin' | 'live' | 'profile'>('home');
  const [selectedAuctionId, setSelectedAuctionId] = useState<string | null>(null);
  const [auctions, setAuctions] = useState<AuctionItem[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const auctionsSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('martelinho_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    const savedAuctions = localStorage.getItem('martelinho_auctions');
    if (savedAuctions) {
      setAuctions(JSON.parse(savedAuctions));
    } else {
      setAuctions(INITIAL_AUCTIONS as any);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (auctions.length > 0) {
      localStorage.setItem('martelinho_auctions', JSON.stringify(auctions));
    }

    const interval = setInterval(() => {
      const now = Date.now();
      let changed = false;
      const updatedAuctions = auctions.map(a => {
        if (a.status === AuctionStatus.ACTIVE && a.endTime < now) {
          changed = true;
          return { ...a, status: a.bidCount > 0 ? AuctionStatus.ENDED : AuctionStatus.CANCELLED };
        }
        return a;
      });

      if (changed) setAuctions(updatedAuctions);
    }, 5000);

    return () => clearInterval(interval);
  }, [auctions]);

  const handleLogin = (userData: User) => {
    const adminUser = { ...userData, isAdmin: userData.name.toLowerCase().includes('admin') };
    setUser(adminUser);
    if (userData.isTrustedMachine) {
      localStorage.setItem('martelinho_user', JSON.stringify(adminUser));
    }
  };

  const handleUpdateUser = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem('martelinho_user', JSON.stringify(updatedUser));
  };

  const handlePlaceBid = (auctionId: string, amount: number) => {
    if (!user) return;
    if (user.balance < amount) {
      alert("Saldo insuficiente para cobrir o lance!");
      return;
    }

    const confirmBid = confirm(`Confirmar seu lance de R$ ${amount.toLocaleString('pt-BR')}? O valor será reservado pelo Martelinho até a conclusão.`);
    if (confirmBid) {
      const newBid: Bid = {
        id: Math.random().toString(36).substr(2, 5),
        bidderName: user.name,
        amount: amount,
        timestamp: Date.now()
      };

      setAuctions(prev => prev.map(a => 
        a.id === auctionId 
          ? { 
              ...a, 
              currentBid: amount, 
              bidCount: a.bidCount + 1, 
              winnerId: 'me',
              winnerName: user.name,
              bids: [newBid, ...(a.bids || [])]
            } 
          : a
      ));
      alert(`🔨 LANCE CONFIRMADO! Você é o líder da disputa.`);
    }
  };

  const handleConfirmDelivery = (auctionId: string) => {
    setAuctions(prev => prev.map(a => a.id === auctionId ? { ...a, status: AuctionStatus.COMPLETED } : a));
    alert(`NEGÓCIO FINALIZADO! 🎊 O dinheiro foi liberado ao vendedor.`);
  };

  const handleToggleLiveFeatured = (auctionId: string) => {
    setAuctions(prev => prev.map(a => a.id === auctionId ? { ...a, isLiveFeatured: !a.isLiveFeatured } : a));
  };

  const scrollToAuctions = () => {
    auctionsSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  if (loading) return <div className="min-h-screen bg-yellow-400 flex items-center justify-center font-black uppercase italic">Preparando Lances...</div>;
  if (!user) return <Auth onLogin={handleLogin} />;

  const selectedAuction = auctions.find(a => a.id === selectedAuctionId);

  const now = Date.now();
  const filteredAuctions = auctions.filter(a => {
    const matchesSearch = a.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          a.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLocation = a.location.toLowerCase().includes(locationQuery.toLowerCase());
    const matchesCategory = !selectedCategory || a.category === selectedCategory;
    const isActive = a.status === AuctionStatus.ACTIVE;
    return matchesSearch && matchesLocation && matchesCategory && isActive;
  });

  const endingToday = filteredAuctions.filter(a => (a.endTime - now) < (1000 * 60 * 60 * 24));
  const otherAuctions = filteredAuctions.filter(a => !endingToday.includes(a));
  
  const userHasItems = auctions.some(a => a.sellerId === 'me');

  if (currentPage === 'live' && selectedAuction) {
    return <LivePresentation auction={selectedAuction} onClose={() => setCurrentPage('admin')} />;
  }

  return (
    <Layout 
      user={user}
      onNavigate={(page) => { setCurrentPage(page as any); setSelectedAuctionId(null); }} 
      currentPage={currentPage}
    >
      {currentPage === 'home' && (
        <div className="space-y-12">
          {/* Hero Section */}
          <div className="relative group">
            <div className="relative rounded-[40px] bg-black p-8 sm:p-16 overflow-hidden shadow-[20px_20px_0px_0px_rgba(250,204,21,1)]">
              <div className="relative z-10 max-w-3xl text-center sm:text-left">
                <h2 className="text-5xl sm:text-7xl font-black text-white leading-[0.9] mb-4 uppercase italic tracking-tighter">
                  DISPUTA DE <br/><span className="text-yellow-400">LANCES!</span>
                </h2>
                <p className="text-xl sm:text-2xl font-black text-white/80 uppercase italic tracking-tighter mb-8 max-w-xl leading-tight">
                  Transforme desapego em dinheiro vivo. A maneira mais divertida de liberar energia e encontrar raridades.
                </p>
                <div className="flex flex-wrap justify-center sm:justify-start gap-4 mt-8">
                  <button onClick={scrollToAuctions} className="bg-black text-yellow-400 border-4 border-yellow-400 font-black px-10 py-5 rounded-xl text-xl uppercase shadow-lg hover:bg-yellow-400 hover:text-black transition-all">Dar Lances 🔎</button>
                  <button onClick={() => setCurrentPage('create')} className="bg-yellow-400 text-black font-black px-10 py-5 rounded-xl text-xl uppercase shadow-lg hover:rotate-2 transition-all">Vender Itens 🔨</button>
                  {user.isAdmin && (
                    <button onClick={() => setCurrentPage('admin')} className="bg-white text-black font-black px-6 py-5 rounded-xl text-xl uppercase border-4 border-black hover:bg-zinc-100 transition-all">Painel Mediação 🎙️</button>
                  )}
                </div>
              </div>
              <div className="absolute -bottom-10 -right-10 text-[200px] opacity-10 pointer-events-none select-none">🔨</div>
            </div>
          </div>

          {/* Busca e Filtros */}
          <section ref={auctionsSectionRef} className="space-y-6 pt-4">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-grow relative">
                <input 
                  type="text" 
                  placeholder="Busque por produtos em disputa..." 
                  className="w-full bg-white border-4 border-black p-5 pl-14 rounded-2xl font-black uppercase text-sm shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] focus:ring-4 focus:ring-yellow-400 outline-none"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-2xl">🔍</span>
              </div>
              <div className="lg:w-1/3 relative">
                <input 
                  type="text" 
                  placeholder="Cidade, UF (Ex: São Paulo, SP)" 
                  className="w-full bg-white border-4 border-black p-5 pl-14 rounded-2xl font-black uppercase text-sm shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] focus:ring-4 focus:ring-yellow-400 outline-none"
                  value={locationQuery}
                  onChange={(e) => setLocationQuery(e.target.value)}
                />
                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-2xl">📍</span>
              </div>
            </div>

            {/* Menu de Categorias */}
            <div className="bg-white border-4 border-black p-6 rounded-[30px] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <div className="flex justify-between items-center mb-4 px-2">
                <p className="text-[10px] font-black uppercase text-black/40 tracking-widest">Navegar Categorias</p>
                <p className="text-[10px] font-black uppercase text-yellow-600 animate-pulse">Deslize para ver mais ➔</p>
              </div>
              <div className="flex overflow-x-auto gap-4 pb-4 custom-scrollbar">
                <button 
                  onClick={() => setSelectedCategory(null)}
                  className={`flex-shrink-0 px-8 py-4 rounded-2xl border-4 border-black font-black uppercase text-xs transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${!selectedCategory ? 'bg-black text-white' : 'bg-white text-black'}`}
                >
                  Tudo
                </button>
                {CATEGORIES.map(cat => (
                  <button 
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.name)}
                    className={`flex-shrink-0 px-8 py-4 rounded-2xl border-4 border-black font-black uppercase text-xs transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center gap-3 ${selectedCategory === cat.name ? 'bg-black text-white' : 'bg-white text-black'}`}
                  >
                    <span className="text-xl">{cat.icon}</span>
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Listagens */}
          <div className="space-y-12">
            {endingToday.length > 0 && (
              <section className="space-y-6">
                <div className="flex items-center gap-4">
                  <span className="text-4xl animate-bounce">🔥</span>
                  <h3 className="text-3xl font-black uppercase italic tracking-tighter text-red-600">Disputas Finais</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {endingToday.map(a => <AuctionCard key={a.id} auction={a} onView={(id) => { setSelectedAuctionId(id); setCurrentPage('detail'); }} />)}
                </div>
              </section>
            )}

            {otherAuctions.length > 0 && (
              <section className="space-y-6">
                <div className="flex items-center gap-4">
                  <span className="text-4xl">📦</span>
                  <h3 className="text-3xl font-black uppercase italic tracking-tighter text-black">Explorar Lances</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {otherAuctions.map(a => (
                    <AuctionCard key={a.id} auction={a} onView={(id) => { setSelectedAuctionId(id); setCurrentPage('detail'); }} />
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      )}

      {currentPage === 'admin' && (
        <AdminDashboard 
          auctions={auctions} 
          onBack={() => setCurrentPage('home')}
          onStartLive={(id) => { setSelectedAuctionId(id); setCurrentPage('live'); }}
          onToggleLiveFeatured={handleToggleLiveFeatured}
        />
      )}

      {currentPage === 'create' && <ListingForm onSuccess={(item) => { setAuctions([item, ...auctions]); setCurrentPage('home'); }} onCancel={() => setCurrentPage('home')} />}
      
      {currentPage === 'profile' && (
        <UserProfile 
          user={user} 
          auctions={auctions} 
          onUpdateUser={handleUpdateUser}
          onViewAuction={(id) => { setSelectedAuctionId(id); setCurrentPage('detail'); }}
          onBack={() => setCurrentPage('home')}
        />
      )}

      {currentPage === 'detail' && selectedAuction && (
        <AuctionDetail 
          auction={selectedAuction} 
          userHasItems={userHasItems}
          onBack={() => setCurrentPage('home')}
          onPlaceBid={handlePlaceBid}
          onOfferSwap={() => alert("Oferta enviada!")} 
          onConfirmDelivery={handleConfirmDelivery}
          onCancelAuction={(id) => setAuctions(prev => prev.filter(a => a.id !== id))}
          onWithdraw={() => {}}
          onCreateItem={() => setCurrentPage('create')}
        />
      )}
    </Layout>
  );
};

export default App;
