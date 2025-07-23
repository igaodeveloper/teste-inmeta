import { useState } from 'react';
import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { cardsApi, tradesApi, userCardsApi } from '@/lib/api';
import { useAuthStore } from '@/store/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CardGrid } from '@/components/cards/card-grid';
import { TradeList } from '@/components/trades/trade-list';
import { CreateTradeModal } from '@/components/trades/create-trade-modal';
import { AddCardModal } from '@/components/cards/add-card-modal';
import { Plus, Search, ArrowRight } from 'lucide-react';
import type { Card as CardType } from '@/types';

export default function Home() {
  const [showCreateTrade, setShowCreateTrade] = useState(false);
  const [showAddCard, setShowAddCard] = useState(false);
  const [selectedCard, setSelectedCard] = useState<CardType | null>(null);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const { data: cardsData, isLoading: isLoadingCards } = useQuery({
    queryKey: ['/api/cards'],
    queryFn: () => cardsApi.getAll(1, 8),
  });

  const { data: trades = [], isLoading: isLoadingTrades } = useQuery({
    queryKey: ['/api/trades'],
    queryFn: tradesApi.getAll,
    enabled: isAuthenticated,
  });

  const { data: userCards = [], isLoading: isLoadingUserCards } = useQuery({
    queryKey: ['/api/me/cards'],
    queryFn: userCardsApi.getMine,
    enabled: isAuthenticated,
  });

  const featuredCards = cardsData?.cards || [];
  const activeTrades = trades.slice(0, 3);
  const userCardCollection = userCards.slice(0, 10);

  const handleViewCard = (card: CardType) => {
    if (isAuthenticated) {
      setSelectedCard(card);
      setShowAddCard(true);
    }
  };

  // Calculate stats
  const stats = {
    totalCards: cardsData?.total || 0,
    activeTrades: trades.length,
    completedTrades: Math.floor(Math.random() * 1000 + 5000), // Mock data
    activeUsers: Math.floor(Math.random() * 1000 + 2000), // Mock data
  };

  const userStats = isAuthenticated ? {
    totalCards: userCards.length,
    rareCards: userCards.filter((uc: any) => uc.card.rarity === 'rare').length,
    epicCards: userCards.filter((uc: any) => uc.card.rarity === 'epic').length,
    legendaryCards: userCards.filter((uc: any) => uc.card.rarity === 'legendary').length,
  } : null;

  return (
    <>
      <main className="pt-16 pb-20 md:pb-8">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/5 to-primary/10 dark:from-gray-800 dark:to-gray-900 py-12 md:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                Trade Your Cards Like a Pro
              </h1>
              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
                Join thousands of collectors in the most trusted marketplace for trading card exchanges
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {isAuthenticated ? (
                  <>
                    <Link href="/my-cards">
                      <Button size="lg">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Your Cards
                      </Button>
                    </Link>
                    <Link href="/cards">
                      <Button size="lg" variant="outline">
                        <Search className="w-4 h-4 mr-2" />
                        Browse Marketplace
                      </Button>
                    </Link>
                  </>
                ) : (
                  <p className="text-gray-600 dark:text-gray-400">Sign in to start trading!</p>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 bg-white dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">{stats.totalCards.toLocaleString()}</div>
                <div className="text-gray-600 dark:text-gray-400">Total Cards</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">{stats.activeTrades.toLocaleString()}</div>
                <div className="text-gray-600 dark:text-gray-400">Active Trades</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">{stats.completedTrades.toLocaleString()}</div>
                <div className="text-gray-600 dark:text-gray-400">Completed Trades</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">{stats.activeUsers.toLocaleString()}</div>
                <div className="text-gray-600 dark:text-gray-400">Active Users</div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Cards Section */}
        <section className="py-12 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">Featured Cards</h2>
                <p className="text-gray-600 dark:text-gray-400">Discover the most sought-after cards in our marketplace</p>
              </div>
              <Link href="/cards">
                <Button variant="ghost" className="text-primary hover:text-primary/80 font-medium">
                  View All <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>

            <CardGrid
              cards={featuredCards}
              isLoading={isLoadingCards}
              onViewDetails={handleViewCard}
              showPrice={true}
            />
          </div>
        </section>

        {/* Active Trades Section */}
        {isAuthenticated && (
          <section className="py-12 bg-white dark:bg-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">Active Trades</h2>
                  <p className="text-gray-600 dark:text-gray-400">Current trade opportunities from our community</p>
                </div>
                <div className="flex space-x-3">
                  <Button onClick={() => setShowCreateTrade(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Trade
                  </Button>
                  <Link href="/trades">
                    <Button variant="ghost" className="text-primary hover:text-primary/80 font-medium">
                      View All <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </div>

              <TradeList trades={activeTrades} isLoading={isLoadingTrades} />

              {activeTrades.length === 0 && !isLoadingTrades && (
                <div className="text-center py-8">
                  <Button onClick={() => setShowCreateTrade(true)} size="lg">
                    <Plus className="w-4 h-4 mr-2" />
                    Create the First Trade
                  </Button>
                </div>
              )}
            </div>
          </section>
        )}

        {/* My Collection Section */}
        {isAuthenticated && userStats && (
          <section className="py-12 bg-gray-50 dark:bg-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">My Collection</h2>
                  <p className="text-gray-600 dark:text-gray-400">Your personal card collection</p>
                </div>
                <Link href="/my-cards">
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Manage Collection
                  </Button>
                </Link>
              </div>

              {/* Collection Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-primary mb-1">{userStats.totalCards}</div>
                    <div className="text-gray-600 dark:text-gray-400 text-sm">Total Cards</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-emerald-500 mb-1">{userStats.rareCards}</div>
                    <div className="text-gray-600 dark:text-gray-400 text-sm">Rare Cards</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-yellow-500 mb-1">{userStats.legendaryCards}</div>
                    <div className="text-gray-600 dark:text-gray-400 text-sm">Legendary</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-purple-500 mb-1">{userStats.epicCards}</div>
                    <div className="text-gray-600 dark:text-gray-400 text-sm">Epic Cards</div>
                  </CardContent>
                </Card>
              </div>

              <CardGrid
                cards={userCardCollection.map((uc: any) => uc.card)}
                isLoading={isLoadingUserCards}
                compact={true}
                emptyMessage="Your collection is empty. Start by adding some cards!"
              />
            </div>
          </section>
        )}
      </main>

      <CreateTradeModal
        isOpen={showCreateTrade}
        onClose={() => setShowCreateTrade(false)}
      />

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
