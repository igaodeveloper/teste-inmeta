import { Link, useLocation } from 'wouter';
import { useAuthStore } from '@/store/auth';
import { Button } from '@/components/ui/button';
import { Copy, Wallet, ArrowLeftRight, Plus } from 'lucide-react';

export function MobileNav() {
  const [location] = useLocation();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!isAuthenticated) return null;

  const isActiveRoute = (path: string) => location === path;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 z-40">
      <div className="flex justify-around py-2">
        <Link href="/cards">
          <Button
            variant="ghost"
            size="sm"
            className={`flex flex-col items-center py-2 px-3 ${
              isActiveRoute('/cards') 
                ? 'text-primary' 
                : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            <Copy className="w-5 h-5" />
            <span className="text-xs mt-1">All Cards</span>
          </Button>
        </Link>

        <Link href="/my-cards">
          <Button
            variant="ghost"
            size="sm"
            className={`flex flex-col items-center py-2 px-3 ${
              isActiveRoute('/my-cards') 
                ? 'text-primary' 
                : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            <Wallet className="w-5 h-5" />
            <span className="text-xs mt-1">My Cards</span>
          </Button>
        </Link>

        <Link href="/trades">
          <Button
            variant="ghost"
            size="sm"
            className={`flex flex-col items-center py-2 px-3 ${
              isActiveRoute('/trades') 
                ? 'text-primary' 
                : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            <ArrowLeftRight className="w-5 h-5" />
            <span className="text-xs mt-1">Trades</span>
          </Button>
        </Link>

        <Button
          variant="ghost"
          size="sm"
          className="flex flex-col items-center py-2 px-3 text-gray-600 dark:text-gray-400"
          onClick={() => {
            // TODO: Open add card modal
          }}
        >
          <Plus className="w-5 h-5" />
          <span className="text-xs mt-1">Add Card</span>
        </Button>
      </div>
    </div>
  );
}
