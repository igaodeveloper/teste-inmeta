import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { cardsApi, userCardsApi } from '@/lib/api';
import { useTradesStore } from '@/store/trades';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { CardGrid } from '@/components/cards/card-grid';
import { Search } from 'lucide-react';
import type { Card } from '@/types';

interface CardSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'offered' | 'wanted';
  title: string;
}

export function CardSelectorModal({ isOpen, onClose, mode, title }: CardSelectorModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const { addOfferedCard, addWantedCard } = useTradesStore();

  // Get user cards for "offered" mode, all cards for "wanted" mode
  const { data: userCards = [], isLoading: isLoadingUserCards } = useQuery({
    queryKey: ['/api/me/cards'],
    queryFn: userCardsApi.getMine,
    enabled: isOpen && mode === 'offered',
  });

  const { data: allCardsData, isLoading: isLoadingAllCards } = useQuery({
    queryKey: ['/api/cards'],
    queryFn: () => cardsApi.getAll(1, 100),
    enabled: isOpen && mode === 'wanted',
  });

  const cards = mode === 'offered' 
    ? userCards.map((uc: any) => uc.card) 
    : allCardsData?.cards || [];

  const filteredCards = cards.filter((card: Card) =>
    card.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    card.set.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectCard = (card: Card) => {
    if (mode === 'offered') {
      addOfferedCard(card);
    } else {
      addWantedCard(card);
    }
  };

  const isLoading = mode === 'offered' ? isLoadingUserCards : isLoadingAllCards;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search cards..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Cards Grid */}
          <CardGrid
            cards={filteredCards}
            isLoading={isLoading}
            onSelectCard={handleSelectCard}
            emptyMessage={
              mode === 'offered' 
                ? "You don't have any cards in your collection yet." 
                : "No cards found matching your search."
            }
          />

          {/* Footer */}
          <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button onClick={onClose}>Done</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
