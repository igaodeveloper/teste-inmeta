import { useMutation, useQueryClient } from '@tanstack/react-query';
import { tradesApi } from '@/lib/api';
import { useAuthStore } from '@/store/auth';
import { toast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import type { Trade } from '@/types';

interface TradeCardProps {
  trade: Trade;
}

export function TradeCard({ trade }: TradeCardProps) {
  const user = useAuthStore((state) => state.user);
  const queryClient = useQueryClient();
  const isOwner = user?.id === trade.creatorId;

  const deleteMutation = useMutation({
    mutationFn: tradesApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/trades'] });
      toast({
        title: "Trade deleted",
        description: "Your trade has been removed.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to delete trade",
        description: error.response?.data?.message || "Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this trade?')) {
      deleteMutation.mutate(trade.id);
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const placeholderImage = "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=140";

  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
          {/* Trade Info */}
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-3">
              <Avatar className="w-10 h-10">
                <AvatarFallback className="bg-primary text-primary-foreground font-medium text-sm">
                  {getInitials(trade.creator.name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">{trade.creator.name}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {formatDistanceToNow(new Date(trade.createdAt), { addSuffix: true })}
                </p>
              </div>
            </div>
            <p className="text-gray-700 dark:text-gray-300">
              {trade.message || "Looking to make a trade!"}
            </p>
          </div>

          {/* Cards Preview */}
          <div className="flex-1 lg:ml-8">
            <div className="grid grid-cols-2 gap-4">
              {/* Offering */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Offering:</h4>
                <div className="flex space-x-2">
                  {trade.offeredCardDetails.slice(0, 1).map((card) => (
                    <img
                      key={card.id}
                      src={card.image || placeholderImage}
                      alt={card.name}
                      className="w-12 h-16 object-cover rounded-lg shadow-sm"
                    />
                  ))}
                  {trade.offeredCardDetails.length > 1 && (
                    <div className="w-12 h-16 bg-primary/10 dark:bg-primary/20 rounded-lg flex items-center justify-center text-primary text-xs font-medium">
                      +{trade.offeredCardDetails.length - 1}
                    </div>
                  )}
                </div>
              </div>
              
              {/* Wanting */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Wanting:</h4>
                <div className="flex space-x-2">
                  {trade.wantedCardDetails.slice(0, 1).map((card) => (
                    <img
                      key={card.id}
                      src={card.image || placeholderImage}
                      alt={card.name}
                      className="w-12 h-16 object-cover rounded-lg shadow-sm"
                    />
                  ))}
                  {trade.wantedCardDetails.length > 1 && (
                    <div className="w-12 h-16 bg-gray-200 dark:bg-gray-600 rounded-lg flex items-center justify-center text-gray-500 dark:text-gray-400 text-xs font-medium">
                      +{trade.wantedCardDetails.length - 1}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-3">
            <Button>
              View Trade
            </Button>
            {isOwner && (
              <Button
                variant="outline"
                size="icon"
                onClick={handleDelete}
                disabled={deleteMutation.isPending}
                className="text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
