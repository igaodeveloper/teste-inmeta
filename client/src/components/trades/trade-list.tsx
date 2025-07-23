import { TradeCard } from './trade-card';
import { TradeSkeleton } from '@/components/common/loading-skeleton';
import type { Trade } from '@/types';

interface TradeListProps {
  trades: Trade[];
  isLoading?: boolean;
}

export function TradeList({ trades, isLoading }: TradeListProps) {
  if (isLoading) {
    return (
      <div className="space-y-6">
        {Array.from({ length: 5 }).map((_, i) => (
          <TradeSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (trades.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400 text-lg">No active trades found.</p>
        <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">Be the first to create a trade!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {trades.map((trade) => (
        <TradeCard key={trade.id} trade={trade} />
      ))}
    </div>
  );
}
