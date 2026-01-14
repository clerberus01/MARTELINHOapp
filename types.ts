
export enum AuctionStatus {
  ACTIVE = 'active',
  ENDED = 'ended',
  CANCELLED = 'cancelled',
  PENDING_PAYMENT = 'pending_payment',
  PAID_PENDING_DELIVERY = 'paid_pending_delivery',
  SWAP_IN_PROGRESS = 'swap_in_progress',
  COMPLETED = 'completed',
  DISPUTE = 'dispute'
}

export interface Bid {
  id: string;
  bidderName: string;
  amount: number;
  timestamp: number;
}

export interface AuctionItem {
  id: string;
  title: string;
  description: string;
  category: string;
  startingBid: number;
  currentBid: number;
  bidCount: number;
  imageUrl: string;
  sellerId: string;
  sellerName: string;
  endTime: number;
  status: AuctionStatus;
  energyScore: number;
  energyMessage?: string;
  location: string;
  deliveryInfo: string;
  acceptsSwap: boolean;
  swapInterests?: string;
  paymentTimestamp?: number;
  winnerId?: string;
  winnerName?: string;
  isLiveFeatured?: boolean;
  bids?: Bid[]; // Histórico de lances para o Modo Apresentador
}

export interface User {
  id: string;
  name: string;
  fullName: string;
  email: string;
  phone: string; // Novo campo para segurança
  cpf: string;
  address: string;
  avatar: string;
  balance: number;
  creditBalance: number;
  isTrustedMachine?: boolean;
  isAdmin?: boolean;
  lastNickChange?: number;
}
