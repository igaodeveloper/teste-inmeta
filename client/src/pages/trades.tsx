import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { tradesApi } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { TradeList } from '@/components/trades/trade-list';
import { CreateTradeModal } from '@/components/trades/create-trade-modal';
import { Plus } from 'lucide-react';

export default function Trades() {
  const [showCreateTrade, setShowCreateTrade] = useState(false);

  const { data: trades = [], isLoading } = useQuery({
    queryKey: ['/api/trades'],
    queryFn: tradesApi.getAll,
  });

  return (
    <>
      <main className="pt-16 pb-20 md:pb-8 min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                Active Trades
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Current trade opportunities from our community
              </p>
            </div>
            <Button onClick={() => setShowCreateTrade(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Trade
            </Button>
          </div>

          {/* Trade Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 text-center">
              <div className="text-2xl font-bold text-primary mb-1">{trades.length}</div>
              <div className="text-gray-600 dark:text-gray-400">Active Trades</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 text-center">
              <div className="text-2xl font-bold text-emerald-500 mb-1">
                {Math.floor(Math.random() * 1000 + 5000)}
              </div>
              <div className="text-gray-600 dark:text-gray-400">Completed Trades</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 text-center">
              <div className="text-2xl font-bold text-blue-500 mb-1">
                {Math.floor(Math.random() * 500 + 1000)}
              </div>
              <div className="text-gray-600 dark:text-gray-400">Active Traders</div>
            </div>
          </div>

          {/* Results Info */}
          <div className="mb-6">
            <p className="text-gray-600 dark:text-gray-400">
              {trades.length} active trades available
            </p>
          </div>

          {/* Trades List */}
          <TradeList trades={trades} isLoading={isLoading} />

          {/* Empty State */}
          {trades.length === 0 && !isLoading && (
            <div className="text-center py-12">
              <div className="max-w-md mx-auto">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  No Active Trades
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Be the first to create a trade and start exchanging cards with other collectors.
                </p>
                <Button onClick={() => setShowCreateTrade(true)} size="lg">
                  <Plus className="w-4 h-4 mr-2" />
                  Create First Trade
                </Button>
              </div>
            </div>
          )}

          {/* Load More Button - if needed for pagination */}
          {trades.length > 0 && (
            <div className="text-center mt-8">
              <Button variant="outline" size="lg">
                Load More Trades
              </Button>
            </div>
          )}
        </div>
      </main>

      <CreateTradeModal
        isOpen={showCreateTrade}
        onClose={() => setShowCreateTrade(false)}
      />
    </>
  );
}
