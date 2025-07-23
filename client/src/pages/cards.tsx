import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { cardsApi } from '@/lib/api';
import { useAuthStore } from '@/store/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { CardGrid } from '@/components/cards/card-grid';
import { AddCardModal } from '@/components/cards/add-card-modal';
import { Search } from 'lucide-react';
import type { Card as CardType } from '@/types';

export default function Cards() {
  const [searchTerm, setSearchTerm] = useState('');
  const [rarityFilter, setRarityFilter] = useState('all');
  const [setFilter, setSetFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [showAddCard, setShowAddCard] = useState(false);
  const [selectedCard, setSelectedCard] = useState<CardType | null>(null);
  
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const { data: cardsData, isLoading } = useQuery({
    queryKey: ['/api/cards', page],
    queryFn: () => cardsApi.getAll(page, 20),
  });

  const cards = cardsData?.cards || [];
  const total = cardsData?.total || 0;

  // Filter cards based on search and filters
  const filteredCards = cards.filter((card: CardType) => {
    const matchesSearch = card.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         card.set.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRarity = rarityFilter === 'all' || card.rarity === rarityFilter;
    const matchesSet = setFilter === 'all' || card.set === setFilter;
    
    return matchesSearch && matchesRarity && matchesSet;
  });

  // Get unique sets for filter
  const uniqueSets = Array.from(new Set(cards.map((card: CardType) => card.set))) as string[];

  const handleViewCard = (card: CardType) => {
    if (isAuthenticated) {
      setSelectedCard(card);
      setShowAddCard(true);
    }
  };

  const handleLoadMore = () => {
    setPage(prev => prev + 1);
  };

  return (
    <>
      <main className="pt-16 pb-20 md:pb-8 min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
              All Cards
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Browse through our complete collection of trading cards
            </p>
          </div>

          {/* Search and Filters */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
                {/* Search */}
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search cards by name or set..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Rarity Filter */}
                <Select value={rarityFilter} onValueChange={setRarityFilter}>
                  <SelectTrigger className="md:w-48">
                    <SelectValue placeholder="All Rarities" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Rarities</SelectItem>
                    <SelectItem value="common">Common</SelectItem>
                    <SelectItem value="rare">Rare</SelectItem>
                    <SelectItem value="epic">Epic</SelectItem>
                    <SelectItem value="legendary">Legendary</SelectItem>
                  </SelectContent>
                </Select>

                {/* Set Filter */}
                <Select value={setFilter} onValueChange={setSetFilter}>
                  <SelectTrigger className="md:w-48">
                    <SelectValue placeholder="All Sets" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sets</SelectItem>
                    {uniqueSets.map((set: string) => (
                      <SelectItem key={set} value={set}>{set}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Results Info */}
          <div className="mb-6">
            <p className="text-gray-600 dark:text-gray-400">
              Showing {filteredCards.length} of {total} cards
            </p>
          </div>

          {/* Cards Grid */}
          <CardGrid
            cards={filteredCards}
            isLoading={isLoading}
            onViewDetails={handleViewCard}
            showPrice={true}
            emptyMessage="No cards match your search criteria."
          />

          {/* Load More Button */}
          {!isLoading && filteredCards.length > 0 && page * 20 < total && (
            <div className="text-center mt-8">
              <Button
                onClick={handleLoadMore}
                variant="outline"
                size="lg"
              >
                Load More Cards
              </Button>
            </div>
          )}
        </div>
      </main>

      {selectedCard && (
        <AddCardModal
          isOpen={showAddCard}
          onClose={() => {
            setShowAddCard(false);
            setSelectedCard(null);
          }}
          card={selectedCard}
        />
      )}
    </>
  );
}
