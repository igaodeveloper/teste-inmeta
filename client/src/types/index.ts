export interface AuthUser {
  id: number;
  username: string;
  email: string;
  name: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  name: string;
}

export interface Card {
  id: number;
  name: string;
  description?: string;
  image?: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  set: string;
  createdAt: Date;
}

export interface UserCard {
  id: number;
  userId: number;
  cardId: number;
  quantity: number;
  addedAt: Date;
  card: Card;
}

export interface Trade {
  id: number;
  creatorId: number;
  message?: string;
  offeredCards: { cardId: number; quantity: number }[];
  wantedCards: { cardId: number; quantity: number }[];
  status: 'open' | 'completed' | 'cancelled';
  createdAt: Date;
  creator: AuthUser;
  offeredCardDetails: Card[];
  wantedCardDetails: Card[];
}

export interface ApiResponse<T> {
  data?: T;
  message?: string;
  success?: boolean;
}

export interface PaginatedResponse<T> {
  cards: T[];
  total: number;
}
