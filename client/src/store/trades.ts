import { create } from 'zustand';
import type { Trade, Card } from '@/types';

interface TradesState {
  trades: Trade[];
  isCreatingTrade: boolean;
  offeredCards: { card: Card; quantity: number }[];
  wantedCards: { card: Card; quantity: number }[];
  setTrades: (trades: Trade[]) => void;
  setCreatingTrade: (creating: boolean) => void;
  addOfferedCard: (card: Card, quantity?: number) => void;
  removeOfferedCard: (cardId: number) => void;
  addWantedCard: (card: Card, quantity?: number) => void;
  removeWantedCard: (cardId: number) => void;
  clearTradeForm: () => void;
}

export const useTradesStore = create<TradesState>((set, get) => ({
  trades: [],
  isCreatingTrade: false,
  offeredCards: [],
  wantedCards: [],
  
  setTrades: (trades: Trade[]) => set({ trades }),
  
  setCreatingTrade: (creating: boolean) => set({ isCreatingTrade: creating }),
  
  addOfferedCard: (card: Card, quantity = 1) => {
    const { offeredCards } = get();
    const existing = offeredCards.find(c => c.card.id === card.id);
    
    if (existing) {
      set({
        offeredCards: offeredCards.map(c => 
          c.card.id === card.id ? { ...c, quantity: c.quantity + quantity } : c
        )
      });
    } else {
      set({ offeredCards: [...offeredCards, { card, quantity }] });
    }
  },
  
  removeOfferedCard: (cardId: number) => {
    const { offeredCards } = get();
    set({ offeredCards: offeredCards.filter(c => c.card.id !== cardId) });
  },
  
  addWantedCard: (card: Card, quantity = 1) => {
    const { wantedCards } = get();
    const existing = wantedCards.find(c => c.card.id === card.id);
    
    if (existing) {
      set({
        wantedCards: wantedCards.map(c => 
          c.card.id === card.id ? { ...c, quantity: c.quantity + quantity } : c
        )
      });
    } else {
      set({ wantedCards: [...wantedCards, { card, quantity }] });
    }
  },
  
  removeWantedCard: (cardId: number) => {
    const { wantedCards } = get();
    set({ wantedCards: wantedCards.filter(c => c.card.id !== cardId) });
  },
  
  clearTradeForm: () => set({ offeredCards: [], wantedCards: [] }),
}));
