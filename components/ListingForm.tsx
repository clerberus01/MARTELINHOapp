
import React, { useState } from 'react';
import { CATEGORIES, TERMS_DISCLAIMER } from '../constants';
import { analyzeItemForDesapego } from '../services/geminiService';
import { AuctionStatus } from '../types';

interface ListingFormProps {
  onSuccess: (newItem: any) => void;
  onCancel: () => void;
}

const ListingForm: React.FC<ListingFormProps> = ({ onSuccess, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    categoryId: CATEGORIES[0].id,
    startingBid: '',
    location: '',
    deliveryInfo: '',
    acceptsSwap: false,
    swapInterests: ''
  });
  const [image, setImage] = useState<string | null>(null);
  const [aiSuggestion, setAiSuggestion] = useState<any>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!formData.title || !formData.description) return;
    setLoading(true);
    try {
      const result = await analyzeItemForDesapego(formData.title, formData.description, image?.split(',')[1]);
      if (!result.isAllowed) {
        alert("O Martelinho não aceita veículos oficiais ou itens restritos por lei.");
        setLoading(false);
        return;
      }
      setAiSuggestion(result);
    } catch (error) {
      console.error(error);
      alert("Erro na análise. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreedToTerms) {
      alert("Concorde com os termos de intermediação!");
      return;
    }
    
    // Validação básica de Cidade, UF
    if (!formData.location.includes(',')) {
      alert("Por favor, informe a Cidade e o Estado no padrão: Cidade, UF (Ex: Curitiba, PR)");
      return;
    }

    const cat = CATEGORIES.find(c => c.id === formData.categoryId);
    const newItem = {
      id: Math.random().toString(36).substr(2, 9),
      title: aiSuggestion?.suggestedTitle || formData.title,
      description: aiSuggestion?.curatedDescription || formData.description,
      category: cat?.name || 'Outros',
      startingBid: Number(formData.startingBid),
      currentBid: Number(formData.startingBid),
      bidCount: 0,
      imageUrl: image || 'https://images.unsplash.com/photo-1581539250439-c96689b516dd?q=80&w=600&auto=format&fit=crop',
      sellerId: 'me',
      sellerName: 'João_Silva_99',
      endTime: Date.now() + 1000 * 60 * 60 * 24 * 3,
      status: AuctionStatus.ACTIVE,
      energyScore: aiSuggestion?.energyScore || 5,
      energyMessage: aiSuggestion?.energyMessage || 'Oportunidade boa para o comprador!',
      location: formData.location,
      deliveryInfo: formData.deliveryInfo || 'Combinar com o vendedor',
      acceptsSwap: formData.acceptsSwap,
      swapInterests: formData.swapInterests
    };
    onSuccess(newItem);
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-2xl border-4 border-black p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] mb-20">
      <div className="flex items-center gap-3 mb-8">
        <span className="text-3xl font-black">🔨</span>
        <h2 className="text-3xl font-black text-black uppercase italic tracking-tighter">Abrir para Lances</h2>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="space-y-5">
            <div>
              <label className="block text-xs font-black text-black uppercase mb-1">Nome do Item</label>
              <input 
                type="text" required
                className="w-full px-4 py-3 rounded-xl border-4 border-black font-bold outline-none focus:ring-4 focus:ring-yellow-400"
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-black text-black uppercase mb-1">Categoria</label>
                <select 
                  className="w-full px-4 py-3 rounded-xl border-4 border-black font-bold outline-none"
                  value={formData.categoryId}
                  onChange={e => setFormData({...formData, categoryId: e.target.value})}
                >
                  {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-black text-black uppercase mb-1">Lance Mínimo (R$)</label>
                <input 
                  type="number" required
                  className="w-full px-4 py-3 rounded-xl border-4 border-black font-black outline-none"
                  value={formData.startingBid}
                  onChange={e => setFormData({...formData, startingBid: e.target.value})}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-xs font-black text-black uppercase mb-1">Localização (Cidade, UF)</label>
                <input 
                  type="text" required
                  className="w-full px-4 py-3 rounded-xl border-4 border-black font-bold outline-none"
                  value={formData.location}
                  onChange={e => setFormData({...formData, location: e.target.value})}
                  placeholder="Ex: Curitiba, PR"
                />
                <p className="text-[9px] font-bold text-black/40 uppercase mt-1">Apenas Cidade e Sigla do Estado.</p>
              </div>
              <div>
                <label className="block text-xs font-black text-black uppercase mb-1">Instruções de Entrega</label>
                <input 
                  type="text" required
                  className="w-full px-4 py-3 rounded-xl border-4 border-black font-bold outline-none"
                  value={formData.deliveryInfo}
                  onChange={e => setFormData({...formData, deliveryInfo: e.target.value})}
                  placeholder="Ex: Retirar no centro ou envio por Uber."
                />
              </div>
            </div>

            <div className="bg-emerald-50 p-4 rounded-xl border-2 border-black/5">
              <label className="flex items-center gap-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  className="w-5 h-5 accent-black"
                  checked={formData.acceptsSwap}
                  onChange={e => setFormData({...formData, acceptsSwap: e.target.checked})}
                />
                <span className="text-xs font-black uppercase text-emerald-800">Aceito Ofertas de Troca</span>
              </label>
            </div>
          </div>

          <div className="flex flex-col">
            <div className="relative flex-grow min-h-[200px] rounded-2xl bg-yellow-50 border-4 border-dashed border-black/20 flex flex-col items-center justify-center overflow-hidden">
              {image ? <img src={image} className="w-full h-full object-cover" /> : <p className="text-[10px] font-black uppercase text-black/40">Foto do Desapego</p>}
              <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleImageChange} />
            </div>
            <textarea 
              required
              className="mt-4 w-full px-4 py-3 rounded-xl border-4 border-black font-medium h-32 outline-none"
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
              placeholder="Detalhes sobre o estado do item..."
            />
          </div>
        </div>

        <div className="pt-6">
          <label className="flex items-center gap-3 cursor-pointer bg-slate-50 p-4 rounded-xl border-2 border-black/5">
            <input 
              type="checkbox" 
              className="w-6 h-6 accent-black" 
              checked={agreedToTerms} 
              onChange={e => setAgreedToTerms(e.target.checked)} 
            />
            <span className="text-[10px] font-black uppercase text-slate-600">
              Estou ciente que o Martelinho apenas intermedia o pagamento via lances e que a entrega é por minha conta e risco combinada com o comprador.
            </span>
          </label>
          
          <button 
            type="button" onClick={handleAnalyze} disabled={loading}
            className="mt-6 w-full bg-black text-white font-black py-5 rounded-xl uppercase hover:bg-zinc-800"
          >
            {loading ? 'Analisando...' : 'Validar Oferta 🤖'}
          </button>
          
          {aiSuggestion && (
            <button 
              type="submit" disabled={!agreedToTerms}
              className="mt-4 w-full bg-yellow-400 text-black border-4 border-black font-black py-5 rounded-xl uppercase shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
            >
              Publicar Disputa! 🔨
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default ListingForm;
