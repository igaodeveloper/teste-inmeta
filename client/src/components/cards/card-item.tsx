import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Card as CardType } from '@/types';

interface CardItemProps {
  card: CardType;
  onViewDetails?: (card: CardType) => void;
  onSelect?: (card: CardType) => void;
  showPrice?: boolean;
  compact?: boolean;
}

const rarityColors = {
  common: 'bg-blue-500',
  rare: 'bg-emerald-500',
  epic: 'bg-purple-500',
  legendary: 'bg-yellow-500',
};

export function CardItem({ card, onViewDetails, onSelect, showPrice, compact = false }: CardItemProps) {
  const placeholderImage = "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600";

  return (
    <Card className={`overflow-hidden hover:shadow-lg transition-shadow duration-300 ${compact ? '' : 'group'}`}>
      <div className="relative group">
        <img
          src={card.image || placeholderImage}
          alt={card.name}
          className={`w-full object-cover group-hover:scale-105 transition-transform duration-300 ${
            compact ? 'h-32' : 'h-48'
          }`}
          onError={(e) => {
            (e.target as HTMLImageElement).src = placeholderImage;
          }}
        />
        <div className="absolute top-3 right-3">
          <Badge className={`${rarityColors[card.rarity]} text-white text-xs font-medium`}>
            {card.rarity.charAt(0).toUpperCase() + card.rarity.slice(1)}
          </Badge>
        </div>
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-opacity duration-300" />
      </div>
      
      <CardContent className={compact ? 'p-3' : 'p-4'}>
        <h3 className={`font-semibold text-gray-900 dark:text-white mb-1 ${compact ? 'text-sm' : ''}`}>
          {card.name}
        </h3>
        <p className={`text-gray-600 dark:text-gray-400 mb-3 ${compact ? 'text-xs' : 'text-sm'}`}>
          {card.set} {card.description && `• ${new Date(card.createdAt).getFullYear()}`}
        </p>
        
        {!compact && (
          <div className="flex justify-between items-center">
            {showPrice && (
              <div className="text-lg font-bold text-primary">
                ${Math.floor(Math.random() * 200 + 10)}.{Math.floor(Math.random() * 100)}
              </div>
            )}
            <div className="flex space-x-2">
              {onSelect && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onSelect(card)}
                >
                  Select
                </Button>
              )}
              {onViewDetails && (
                <Button
                  size="sm"
                  onClick={() => onViewDetails(card)}
                >
                  View Details
                </Button>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
