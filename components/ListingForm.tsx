
import React, { useState } from 'react';
import { CATEGORIES } from '../constants';
import { analyzeItemForDesapego } from '../services/geminiService';
import { AuctionStatus } from '../types';

interface ListingFormProps {
  onSuccess: (newItem: any) => void;
  onCancel: () => void;
}

const ListingForm: React.FC<ListingFormProps> = ({ onSuccess, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formErrors, setFormErrors] = useState<string[]>([]);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    categoryId: CATEGORIES[0].id,
    startingBid: '1',
    durationDays: '3',
    location: '',
    deliveryInfo: '',
    acceptsSwap: false,
    hasDefects: false,
    swapInterests: ''
  });
  const [images, setImages] = useState<string[]>([]);
  const [aiSuggestion, setAiSuggestion] = useState<any>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const remainingSlots = 5 - images.length;
      const filesToProcess = Array.from(files).slice(0, remainingSlots);
      filesToProcess.forEach((file: File) => {
        const reader = new FileReader();
        reader.onloadend = () => setImages(prev => [...prev, reader.result as string]);
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => setImages(prev => prev.filter((_, i) => i !== index));

  const validate = () => {
    const errors: string[] = [];
    if (!formData.title.trim()) errors.push("Dê um título ao seu desapego.");
    if (!formData.description.trim()) errors.push("Conte um pouco sobre o estado do item.");
    if (images.length === 0) errors.push("Adicione pelo menos uma foto real.");
    if (!formData.location.trim()) errors.push("Informe sua localização.");
    if (!agreedToTerms) errors.push("Você precisa aceitar os termos da plataforma.");
    setFormErrors(errors);
    return errors.length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      // Opcional: Análise IA para melhorar o anúncio
      const suggestion = await analyzeItemForDesapego(formData.title, formData.description, images[0]);
      setAiSuggestion(suggestion);
    } catch (err) {
      console.error("Erro na curadoria IA:", err);
    } finally {
      setLoading(false);
    }

    const days = Math.min(Math.max(Number(formData.durationDays), 1), 10);
    const newItem = {
      id: 'auc_' + Math.random().toString(36).substr(2, 9),
      title: formData.title,
      description: formData.description,
      category: CATEGORIES.find(c => c.id === formData.categoryId)?.name || 'Outros',
      startingBid: Number(formData.startingBid) || 1,
      currentBid: Number(formData.startingBid) || 1,
      bidCount: 0,
      imageUrl: images[0],
      imageUrls: images,
      sellerId: 'me',
      sellerName: 'você',
      endTime: Date.now() + 1000 * 60 * 60 * 24 * days,
      status: AuctionStatus.ACTIVE,
      energyScore: 7,
      location: formData.location,
      deliveryInfo: formData.deliveryInfo || 'A combinar entrega presencial',
      acceptsSwap: formData.acceptsSwap,
      hasDefects: formData.hasDefects,
      bids: [],
      swapOffers: [],
      chatMessages: []
    };

    setShowSuccess(true);
    setTimeout(() => onSuccess(newItem), 2000);
  };

  return (
    <div className="max-w-2xl mx-auto bg-white border-4 border-black rounded-[32px] p-6 sm:p-10 shadow-[12px_12px_0px_0px_#000] mb-20">
      {showSuccess ? (
        <div className="py-20 text-center animate-in zoom-in duration-300">
          <span className="text-6xl block mb-6 animate-bounce">🔨</span>
          <h2 className="text-3xl font-black uppercase italic tracking-tighter">MARTELO BATIDO!</h2>
          <p className="text-zinc-400 font-bold uppercase text-xs mt-2 tracking-widest">Seu anúncio já está no ar.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="flex justify-between items-end border-b-4 border-black pb-4">
            <div>
              <h2 className="text-2xl font-black uppercase italic tracking-tighter leading-none">Anunciar Desapego</h2>
              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-1">Transforme o que você não usa em dinheiro no bolso</p>
            </div>
            <button onClick={onCancel} type="button" className="text-xs font-black uppercase underline decoration-2 decoration-red-500 hover:text-red-500 transition-colors">Desistir</button>
          </div>

          {formErrors.length > 0 && (
            <div className="bg-red-50 border-2 border-red-500 p-4 rounded-xl">
              <ul className="list-disc list-inside text-[10px] font-black uppercase text-red-600">
                {formErrors.map((err, i) => <li key={i}>{err}</li>)}
              </ul>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Seção de Fotos e Detalhes */}
            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-black uppercase mb-2 tracking-widest text-zinc-400">Fotos Reais (Máx 5)</label>
                <div className="grid grid-cols-3 gap-2">
                  {images.map((img, i) => (
                    <div key={i} className="aspect-square relative border-2 border-black rounded-xl overflow-hidden group">
                      <img src={img} className="w-full h-full object-cover" />
                      <button 
                        type="button"
                        onClick={() => removeImage(i)} 
                        className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white font-black text-xs"
                      >
                        REMOVER
                      </button>
                    </div>
                  ))}
                  {images.length < 5 && (
                    <div className="relative aspect-square border-2 border-dashed border-black rounded-xl flex flex-col items-center justify-center bg-zinc-50 hover:bg-yellow-50 cursor-pointer transition-colors">
                      <span className="text-2xl font-black">+</span>
                      <span className="text-[8px] font-black uppercase">Adicionar</span>
                      <input type="file" multiple accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleImageChange} />
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase mb-1 tracking-widest text-zinc-400">Descrição do Estado</label>
                <textarea 
                  required
                  className="w-full bg-zinc-50 border-2 border-black p-4 rounded-xl text-xs font-bold min-h-[120px] focus:ring-4 ring-yellow-400 transition-all outline-none" 
                  placeholder="Seja honesto: tempo de uso, se tem marcas, detalhes técnicos..."
                  value={formData.description} 
                  onChange={e => setFormData({...formData, description: e.target.value})} 
                />
              </div>
            </div>

            {/* Seção de Dados do Leilão */}
            <div className="space-y-5">
              <div>
                <label className="block text-[10px] font-black uppercase mb-1 tracking-widest text-zinc-400">O que você está vendendo?</label>
                <input 
                  type="text" required
                  className="w-full bg-zinc-50 border-2 border-black p-3 rounded-xl text-sm font-black uppercase focus:ring-4 ring-yellow-400 outline-none" 
                  placeholder="Ex: Furadeira Bosch 500W"
                  value={formData.title} 
                  onChange={e => setFormData({...formData, title: e.target.value})} 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black uppercase mb-1 tracking-widest text-zinc-400">Lance Inicial (R$)</label>
                  <input 
                    type="number" required min="1"
                    className="w-full bg-zinc-50 border-2 border-black p-3 rounded-xl text-lg font-black focus:ring-4 ring-yellow-400 outline-none" 
                    value={formData.startingBid} 
                    onChange={e => setFormData({...formData, startingBid: e.target.value})} 
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase mb-1 tracking-widest text-zinc-400">Duração (Dias)</label>
                  <select 
                    className="w-full bg-zinc-50 border-2 border-black p-3 rounded-xl text-sm font-black appearance-none focus:ring-4 ring-yellow-400 outline-none"
                    value={formData.durationDays}
                    onChange={e => setFormData({...formData, durationDays: e.target.value})}
                  >
                    {[1,2,3,5,7,10].map(d => <option key={d} value={d}>{d} Dias</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase mb-1 tracking-widest text-zinc-400">Categoria</label>
                <select 
                  className="w-full bg-zinc-50 border-2 border-black p-3 rounded-xl text-xs font-black uppercase appearance-none focus:ring-4 ring-yellow-400 outline-none"
                  value={formData.categoryId}
                  onChange={e => setFormData({...formData, categoryId: e.target.value})}
                >
                  {CATEGORIES.map(cat => <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase mb-1 tracking-widest text-zinc-400">Localização (Cidade, UF)</label>
                <input 
                  type="text" required
                  className="w-full bg-zinc-50 border-2 border-black p-3 rounded-xl text-xs font-bold uppercase focus:ring-4 ring-yellow-400 outline-none" 
                  placeholder="Ex: Curitiba, PR"
                  value={formData.location} 
                  onChange={e => setFormData({...formData, location: e.target.value})} 
                />
              </div>

              <div className="flex flex-col gap-3 pt-2">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    className="w-5 h-5 accent-black border-2 border-black rounded" 
                    checked={formData.acceptsSwap} 
                    onChange={e => setFormData({...formData, acceptsSwap: e.target.checked})} 
                  />
                  <span className="text-[10px] font-black uppercase group-hover:text-black transition-colors">Aceito Propostas de Troca 🔄</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    className="w-5 h-5 accent-black border-2 border-black rounded" 
                    checked={formData.hasDefects} 
                    onChange={e => setFormData({...formData, hasDefects: e.target.checked})} 
                  />
                  <span className="text-[10px] font-black uppercase group-hover:text-black transition-colors">O item possui detalhes/defeitos ⚠️</span>
                </label>
              </div>
            </div>
          </div>

          <div className="bg-black text-white p-6 rounded-2xl space-y-4">
             <label className="flex items-start gap-4 cursor-pointer">
                <input 
                  type="checkbox" required
                  className="w-6 h-6 accent-yellow-400 mt-1 shrink-0" 
                  checked={agreedToTerms} 
                  onChange={e => setAgreedToTerms(e.target.checked)} 
                />
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase text-yellow-400 block">Termo de Responsabilidade</span>
                  <span className="text-[9px] font-medium leading-tight text-zinc-400 block">
                    Declaro que o item é meu e as fotos são reais. Entendo que o Martelinho retém 10% de comissão e que sou responsável pela entrega conforme combinado no chat após o arremate.
                  </span>
                </div>
             </label>

             <button 
                type="submit" 
                disabled={loading}
                className={`w-full py-5 rounded-xl font-black text-xl uppercase italic tracking-tighter border-4 border-white transition-all
                  ${loading ? 'bg-zinc-800 cursor-wait' : 'bg-yellow-400 text-black shadow-[0_6px_0_0_#fff] hover:translate-y-1 hover:shadow-none'}`}
              >
                {loading ? 'ANALISANDO...' : 'PUBLICAR AGORA 🔨'}
              </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ListingForm;
