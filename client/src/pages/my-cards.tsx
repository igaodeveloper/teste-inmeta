import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { userCardsApi } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { CardGrid } from '@/components/cards/card-grid';
import { Search, Plus } from 'lucide-react';
import { Link } from 'wouter';
import type { UserCard } from '@/types';

export default function MyCards() {
  const [searchTerm, setSearchTerm] = useState('');
  const [rarityFilter, setRarityFilter] = useState('all');
  const [setFilter, setSetFilter] = useState('all');

  const { data: userCards = [], isLoading } = useQuery({
    queryKey: ['/api/me/cards'],
    queryFn: userCardsApi.getMine,
  });

  // Extract cards from user cards
  const cards = userCards.map((uc: UserCard) => uc.card);

  // Filter cards
  const filteredCards = cards.filter((card: any) => {
    const matchesSearch = card.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         card.set.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRarity = rarityFilter === 'all' || card.rarity === rarityFilter;
    const matchesSet = setFilter === 'all' || card.set === setFilter;
    
    return matchesSearch && matchesRarity && matchesSet;
  });

  // Get unique sets
  const uniqueSets = Array.from(new Set(cards.map((card: any) => card.set))) as string[];

  // Calculate stats
  const stats = {
    totalCards: userCards.length,
    rareCards: cards.filter((card: any) => card.rarity === 'rare').length,
    epicCards: cards.filter((card: any) => card.rarity === 'epic').length,
    legendaryCards: cards.filter((card: any) => card.rarity === 'legendary').length,
  };

  return (
    <main className="pt-16 pb-20 md:pb-8 min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
              My Collection
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage and showcase your card collection
            </p>
          </div>
          <Link href="/cards">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Cards
            </Button>
          </Link>
        </div>

        {/* Collection Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary mb-1">{stats.totalCards}</div>
              <div className="text-gray-600 dark:text-gray-400 text-sm">Total Cards</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-emerald-500 mb-1">{stats.rareCards}</div>
              <div className="text-gray-600 dark:text-gray-400 text-sm">Rare Cards</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-yellow-500 mb-1">{stats.legendaryCards}</div>
              <div className="text-gray-600 dark:text-gray-400 text-sm">Legendary</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-500 mb-1">{stats.epicCards}</div>
              <div className="text-gray-600 dark:text-gray-400 text-sm">Epic Cards</div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search your cards..."
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
            Showing {filteredCards.length} of {stats.totalCards} cards in your collection
          </p>
        </div>

        {/* Cards Grid */}
        <CardGrid
          cards={filteredCards}
          isLoading={isLoading}
          compact={true}
          emptyMessage={
            userCards.length === 0 
              ? "Your collection is empty. Start by adding some cards!"
              : "No cards match your search criteria."
          }
        />

        {/* Empty State */}
        {userCards.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Start Building Your Collection
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Discover amazing cards and add them to your personal collection.
              </p>
              <Link href="/cards">
                <Button size="lg">
                  <Plus className="w-4 h-4 mr-2" />
                  Browse All Cards
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
