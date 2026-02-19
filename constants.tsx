
import React from 'react';

export const PLATFORM_FEE_PERCENTAGE = 10;
export const SWAP_FEE_PERCENTAGE = 5;
export const AUTO_RELEASE_DAYS = 3;

export const TERMS_DISCLAIMER = {
  delivery: "O Martelinho atua exclusivamente como intermediário financeiro. O frete e a integridade do item são de responsabilidade TOTAL das partes envolvidas.",
  fees: "Nossas taxas são retidas no ato do arremate. Não há estorno de taxas em caso de desistência, pois o serviço de intermediação é prestado no fechamento da disputa.",
  autoRelease: "Segurança: O dinheiro fica em custódia. O comprador tem 72h após o recebimento para contestar. Sem aviso, o valor é liberado automaticamente ao vendedor.",
  cancellation: "Responsabilidade: Usuários que não honrarem o pagamento serão banidos e seus dados preservados para fins de cobrança e segurança jurídica."
};

export const PRIVACY_POLICY = {
  title: "Política de Privacidade & LGPD",
  content: `O Martelinho (Intermediações Digitais) preza pela proteção de seus dados pessoais em conformidade com a Lei 13.709/2018 (LGPD).
    
    1. FINALIDADE DA COLETA:
    - CPF e Nome Completo: Obrigatórios para a emissão de comprovantes de transação e prevenção a crimes financeiros/lavagem de dinheiro (Art. 7º, II e VI).
    - Endereço e Telefone: Necessários para a execução do contrato de compra e venda entre as partes (Art. 7º, V).
    
    2. COMPARTILHAMENTO:
    Seus dados de contato e endereço são revelados apenas à contraparte da sua negociação específica APÓS a confirmação do pagamento, visando a entrega do bem.
    
    3. SEUS DIREITOS:
    Você possui direito de acesso, correção, anonimização ou exclusão de seus dados, bem como a portabilidade das informações através das configurações de seu perfil.
    
    4. RETENÇÃO:
    Dados de transações financeiras são conservados pelo prazo legal exigido pelo Código Civil e normas do Banco Central.`
};

export interface CategoryInfo {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export const CATEGORIES: CategoryInfo[] = [
  { id: 'eletronicos', name: 'Eletrônicos', description: 'Celulares, notebooks, consoles, periféricos', icon: '📱' },
  { id: 'casa', name: 'Casa & Decoração', description: 'Móveis pequenos, utensílios, itens decorativos', icon: '🏠' },
  { id: 'ferramentas', name: 'Ferramentas & Construção', description: 'Ferramentas manuais, elétricas, equipamentos', icon: '🛠️' },
  { id: 'musica', name: 'Instrumentos Musicais', description: 'Guitarras, teclados, baterias, violões e acessórios', icon: '🎸' },
  { id: 'veiculos', name: 'Peças & Acessórios', description: 'Peças automotivas, acessórios, bicicletas, motos (Sem registro oficial)', icon: '🚲' },
  { id: 'moda', name: 'Moda & Acessórios', description: 'Roupas, tênis, relógios, bolsas', icon: '👕' },
  { id: 'colecionaveis', name: 'Colecionáveis', description: 'Cards, action figures, itens raros, cultura pop', icon: '🧸' },
  { id: 'games', name: 'Games', description: 'Jogos físicos, consoles antigos, acessórios', icon: '🎮' },
  { id: 'outros', name: 'Outros', description: 'Categoria geral', icon: '📦' }
];

export const INITIAL_ADS = [
  {
    id: '1',
    title: 'Furadeira Bosch Profissional',
    description: 'Pouco uso, potente e com maleta. Ideal para quem faz bicos.',
    category: 'Ferramentas & Construção',
    startingBid: 120,
    currentBid: 185,
    bidCount: 8,
    imageUrl: 'https://images.unsplash.com/photo-1504148455328-497c596d229f?q=80&w=600&auto=format&fit=crop',
    imageUrls: [
      'https://images.unsplash.com/photo-1504148455328-497c596d229f?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1581539250439-c96689b516dd?q=80&w=600&auto=format&fit=crop'
    ],
    sellerId: 'seller_1',
    sellerName: 'Marcos_Bicos',
    endTime: Date.now() + 1000 * 60 * 60 * 4,
    status: 'active',
    energyScore: 9,
    energyMessage: 'Oportunidade de ouro! Lance imbatível.',
    location: 'São Paulo, SP',
    deliveryInfo: 'Entrego em mãos na Linha Vermelha do Metrô.',
    acceptsSwap: true,
    hasDefects: false,
    swapInterests: 'Aceito ferramentas manuais.',
    isLiveFeatured: true
  },
  {
    id: '2',
    title: 'Guitarra Giannini Antiga',
    description: 'Som vintage, precisa de cordas novas. O captador da ponte está com mau contato intermitente. Um achado para colecionador que saiba mexer.',
    category: 'Instrumentos Musicais',
    startingBid: 250,
    currentBid: 310,
    bidCount: 12,
    imageUrl: 'https://images.unsplash.com/photo-1550291652-6ea9114a47b1?q=80&w=600&auto=format&fit=crop',
    imageUrls: [
      'https://images.unsplash.com/photo-1550291652-6ea9114a47b1?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1605020420620-20c943cc4669?q=80&w=600&auto=format&fit=crop'
    ],
    sellerId: 'seller_2',
    sellerName: 'Rock_Store',
    endTime: Date.now() + 1000 * 60 * 60 * 20,
    status: 'active',
    energyScore: 10,
    energyMessage: 'Relíquia pura! Vai sair rápido.',
    location: 'Rio de Janeiro, RJ',
    deliveryInfo: 'Combinar retirada.',
    acceptsSwap: false,
    hasDefects: true,
    isLiveFeatured: true
  }
];
