
export enum AdStatus {
  ACTIVE = 'active',
  ENDED = 'ended',
  CANCELLED = 'cancelled',
  PENDING_PAYMENT = 'pending_payment',
  PAID_PENDING_DELIVERY = 'paid_pending_delivery',
  SWAP_IN_PROGRESS = 'swap_in_progress',
  SWAP_ACCEPTED = 'swap_accepted',
  COMPLETED = 'completed',
  DISPUTE = 'dispute'
}

export interface Bid {
  id: string;
  bidderName: string;
  amount: number;
  timestamp: number;
}

export interface SwapOffer {
  id: string;
  proposerId: string;
  proposerName: string;
  offeredItemId: string;
  offeredItemTitle: string;
  offeredItemPrice: number;
  status: 'pending' | 'accepted' | 'rejected' | 'paid';
  timestamp: number;
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: number;
}

export interface AdItem {
  id: string;
  title: string;
  description: string;
  category: string;
  startingBid: number;
  currentBid: number;
  bidCount: number;
  imageUrl: string;
  imageUrls: string[];
  sellerId: string;
  sellerName: string;
  sellerReputation?: number;
  endTime: number;
  status: AdStatus;
  energyScore: number;
  energyMessage?: string;
  location: string;
  deliveryInfo: string;
  acceptsSwap: boolean;
  hasDefects: boolean;
  swapInterests?: string;
  paymentTimestamp?: number;
  winnerId?: string;
  winnerName?: string;
  isLiveFeatured?: boolean;
  bids?: Bid[];
  swapOffers?: SwapOffer[];
  chatMessages?: Message[];
}

export interface User {
  id: string;
  name: string;
  fullName: string;
  email: string;
  phone: string;
  cpf: string;
  address: string;
  avatar: string;
  balance: number;
  creditBalance: number;
  isTrustedMachine?: boolean;
  isAdmin?: boolean;
  lastNickChange?: number;
  reputationScore: number;
  successfulDeals: number;
  totalRatings: number;
}
