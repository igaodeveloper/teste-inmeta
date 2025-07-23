import { CardItem } from './card-item';
import { CardSkeleton } from '@/components/common/loading-skeleton';
import type { Card } from '@/types';

interface CardGridProps {
  cards: Card[];
  isLoading?: boolean;
  onViewDetails?: (card: Card) => void;
  onSelectCard?: (card: Card) => void;
  showPrice?: boolean;
  compact?: boolean;
  emptyMessage?: string;
}

export function CardGrid({ 
  cards, 
  isLoading, 
  onViewDetails, 
  onSelectCard, 
  showPrice, 
  compact = false,
  emptyMessage = "No cards found."
}: CardGridProps) {
  if (isLoading) {
    return (
      <div className={`grid gap-6 ${compact ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-5' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'}`}>
        {Array.from({ length: compact ? 10 : 8 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (cards.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400 text-lg">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={`grid gap-6 ${compact ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-5' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'}`}>
      {cards.map((card) => (
        <CardItem
          key={card.id}
          card={card}
          onViewDetails={onViewDetails}
          onSelect={onSelectCard}
          showPrice={showPrice}
          compact={compact}
        />
      ))}
    </div>
  );
}
