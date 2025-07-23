import { create } from 'zustand';
import type { Card, UserCard } from '@/types';

interface CardsState {
  allCards: Card[];
  userCards: UserCard[];
  selectedCards: Card[];
  isLoading: boolean;
  setAllCards: (cards: Card[]) => void;
  setUserCards: (cards: UserCard[]) => void;
  addSelectedCard: (card: Card) => void;
  removeSelectedCard: (cardId: number) => void;
  clearSelectedCards: () => void;
  setLoading: (loading: boolean) => void;
}

export const useCardsStore = create<CardsState>((set, get) => ({
  allCards: [],
  userCards: [],
  selectedCards: [],
  isLoading: false,
  
  setAllCards: (cards: Card[]) => set({ allCards: cards }),
  
  setUserCards: (cards: UserCard[]) => set({ userCards: cards }),
  
  addSelectedCard: (card: Card) => {
    const { selectedCards } = get();
    if (!selectedCards.find(c => c.id === card.id)) {
      set({ selectedCards: [...selectedCards, card] });
    }
  },
  
  removeSelectedCard: (cardId: number) => {
    const { selectedCards } = get();
    set({ selectedCards: selectedCards.filter(c => c.id !== cardId) });
  },
  
  clearSelectedCards: () => set({ selectedCards: [] }),
  
  setLoading: (loading: boolean) => set({ isLoading: loading }),
}));
