
import React from 'react';
import { PLATFORM_FEE_PERCENTAGE, SWAP_FEE_PERCENTAGE, AUTO_RELEASE_DAYS } from '../constants';

interface InfoPagesProps {
  view: 'how-it-works' | 'fees' | 'lgpd';
  onBack: () => void;
}

const InfoPages: React.FC<InfoPagesProps> = ({ view, onBack }) => {
  const renderHowItWorks = () => (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center space-y-4">
        <h2 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter">COMO FUNCIONA? 🔨</h2>
        <p className="text-zinc-400 font-bold uppercase text-xs tracking-widest">O MARTELINHO É O JUIZ DA SUA NEGOCIAÇÃO.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { step: "01", title: "DESAPEGUE", desc: "Tire fotos reais, descreva o estado honestamente e defina um lance inicial. Seu anúncio entra na vitrine para milhares de interessados." },
          { step: "02", title: "A DISPUTA", desc: "Interessados dão lances. Se aceitar trocas, analise as propostas. O chat abre automaticamente após o arremate ou aceite." },
          { step: "03", title: "NEGÓCIO FECHADO", desc: "O comprador paga à plataforma. O dinheiro fica seguro. Vocês combinam a entrega. Após 72h do recebimento, o valor é liberado." }
        ].map((item, i) => (
          <div key={i} className="bg-white border-4 border-black p-8 rounded-[32px] shadow-[8px_8px_0px_0px_#000] relative group hover:-translate-y-2 transition-transform">
            <span className="absolute -top-4 -left-4 bg-yellow-400 text-black border-4 border-black w-12 h-12 flex items-center justify-center font-black text-xl rounded-2xl rotate-[-10deg] group-hover:rotate-0 transition-transform">
              {item.step}
            </span>
            <h3 className="text-2xl font-black uppercase italic mb-4 mt-2">{item.title}</h3>
            <p className="text-xs font-bold text-zinc-500 leading-relaxed uppercase">{item.desc}</p>
          </div>
        ))}
      </div>

      <div className="bg-black text-yellow-400 p-8 rounded-[40px] text-center">
        <p className="text-xl font-black uppercase italic tracking-tighter mb-2">SEGURANÇA EM PRIMEIRO LUGAR</p>
        <p className="text-[10px] font-bold uppercase tracking-widest text-white/60">Nunca faça pagamentos fora da plataforma. O Martelinho não garante negócios feitos "por fora".</p>
      </div>
    </div>
  );

  const renderFees = () => (
    <div className="max-w-3xl mx-auto space-y-12 animate-in fade-in duration-500">
      <div className="text-center space-y-4">
        <h2 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter">TAXAS E PRAZOS 💰</h2>
        <p className="text-zinc-400 font-bold uppercase text-xs tracking-widest">TRANSPARÊNCIA TOTAL. SEM SURPRESAS NO ARREMATE.</p>
      </div>

      <div className="space-y-6">
        <div className="bg-white border-4 border-black rounded-[32px] overflow-hidden shadow-[8px_8px_0px_0px_#000]">
          <table className="w-full text-left">
            <thead className="bg-yellow-400 border-b-4 border-black">
              <tr>
                <th className="p-5 font-black uppercase text-xs">SERVIÇO</th>
                <th className="p-5 font-black uppercase text-xs">TAXA</th>
              </tr>
            </thead>
            <tbody className="divide-y-4 divide-black">
              <tr>
                <td className="p-5 font-bold uppercase text-xs italic">Intermediação de Venda</td>
                <td className="p-5 font-black text-2xl tracking-tighter">{PLATFORM_FEE_PERCENTAGE}%</td>
              </tr>
              <tr>
                <td className="p-5 font-bold uppercase text-xs italic">Intermediação de Troca (Swap)</td>
                <td className="p-5 font-black text-2xl tracking-tighter">{SWAP_FEE_PERCENTAGE}%</td>
              </tr>
              <tr>
                <td className="p-5 font-bold uppercase text-xs italic">Taxa de Saque</td>
                <td className="p-5 font-black text-2xl tracking-tighter">R$ 0,00</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-zinc-900 text-white p-6 rounded-3xl border-2 border-black">
            <h4 className="text-yellow-400 font-black uppercase italic text-sm mb-2">PRAZO DE LIBERAÇÃO</h4>
            <p className="text-[10px] font-bold uppercase leading-relaxed text-zinc-400">
              Após o comprador marcar como "Recebido", o valor entra em quarentena por {AUTO_RELEASE_DAYS} dias ({AUTO_RELEASE_DAYS * 24}h). Este é o prazo para contestação de defeitos não informados.
            </p>
          </div>
          <div className="bg-white p-6 rounded-3xl border-4 border-black shadow-[4px_4px_0px_0px_#000]">
            <h4 className="font-black uppercase italic text-sm mb-2">DESISTÊNCIAS</h4>
            <p className="text-[10px] font-bold uppercase leading-relaxed text-zinc-500">
              Se o comprador não pagar em 24h, o item volta para disputa e o usuário é negativado. Desistências após o pagamento retêm a taxa de serviço da plataforma.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderLGPD = () => (
    <div className="max-w-2xl mx-auto space-y-12 animate-in fade-in duration-500">
      <div className="text-center space-y-4">
        <h2 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter leading-none">SEGURANÇA E LGPD 🛡️</h2>
        <p className="text-zinc-400 font-bold uppercase text-xs tracking-widest">SEUS DADOS SÃO PATRIMÔNIO. NÓS PROTEGEMOS.</p>
      </div>

      <div className="prose prose-sm uppercase font-bold text-zinc-600 text-[10px] leading-loose space-y-6">
        <section className="bg-white border-2 border-black p-6 rounded-2xl">
          <h3 className="text-black font-black text-xs italic mb-2">1. FINALIDADE E NECESSIDADE</h3>
          <p>O Martelinho coleta CPF e Nome para cumprir obrigações legais de identificação em transações financeiras. Seu endereço é utilizado exclusivamente para a execução do contrato de compra e venda entre você e a contraparte.</p>
        </section>

        <section className="bg-white border-2 border-black p-6 rounded-2xl">
          <h3 className="text-black font-black text-xs italic mb-2">2. CONTROLE TOTAL (PORTABILIDADE)</h3>
          <p>Você pode exportar todos os seus dados pessoais em formato JSON diretamente nas suas configurações de perfil. Este é o seu direito de portabilidade garantido pelo Art. 18 da LGPD.</p>
        </section>

        <section className="bg-yellow-400/10 border-2 border-yellow-400 p-6 rounded-2xl">
          <h3 className="text-black font-black text-xs italic mb-2">3. ENCARREGADO DE DADOS (DPO)</h3>
          <p>Qualquer dúvida sobre o tratamento de seus dados ou solicitações específicas pode ser enviada ao nosso canal de privacidade (privacidade@martelinho.app). Garantimos a exclusão definitiva de contas em até 15 dias úteis após a solicitação, desde que não existam pendências financeiras.</p>
        </section>
      </div>
    </div>
  );

  return (
    <div className="py-6">
      <button onClick={onBack} className="mb-8 text-[10px] font-black uppercase flex items-center gap-2 hover:translate-x-[-4px] transition-transform">
        ← Voltar para explorar
      </button>

      {view === 'how-it-works' && renderHowItWorks()}
      {view === 'fees' && renderFees()}
      {view === 'lgpd' && renderLGPD()}
    </div>
  );
};

export default InfoPages;
