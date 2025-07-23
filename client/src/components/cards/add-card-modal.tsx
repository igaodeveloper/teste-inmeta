import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { userCardsApi } from '@/lib/api';
import { toast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { Card } from '@/types';

interface AddCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  card: Card;
}

export function AddCardModal({ isOpen, onClose, card }: AddCardModalProps) {
  const [quantity, setQuantity] = useState(1);
  const queryClient = useQueryClient();

  const addCardMutation = useMutation({
    mutationFn: userCardsApi.add,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/me/cards'] });
      toast({
        title: "Card added!",
        description: `${card.name} has been added to your collection.`,
      });
      onClose();
      setQuantity(1);
    },
    onError: (error: any) => {
      toast({
        title: "Failed to add card",
        description: error.response?.data?.message || "Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addCardMutation.mutate({
      cardId: card.id,
      quantity,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Card to Collection</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <img
              src={card.image || "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=140"}
              alt={card.name}
              className="w-16 h-20 object-cover rounded-lg"
            />
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">{card.name}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{card.set}</p>
              <p className="text-xs text-gray-500 dark:text-gray-500 capitalize">{card.rarity}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                max="10"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                className="w-full"
              />
            </div>

            <div className="flex justify-end space-x-3">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={addCardMutation.isPending}>
                {addCardMutation.isPending ? 'Adding...' : 'Add to Collection'}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
