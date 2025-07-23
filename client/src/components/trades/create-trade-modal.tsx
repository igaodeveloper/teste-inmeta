import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { tradesApi } from '@/lib/api';
import { useTradesStore } from '@/store/trades';
import { toast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { CardSelectorModal } from '@/components/trades/card-selector-modal';
import { Plus, X } from 'lucide-react';

const tradeSchema = z.object({
  message: z.string().min(1, 'Please describe your trade'),
});

type TradeForm = z.infer<typeof tradeSchema>;

interface CreateTradeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateTradeModal({ isOpen, onClose }: CreateTradeModalProps) {
  const [showOfferedSelector, setShowOfferedSelector] = useState(false);
  const [showWantedSelector, setShowWantedSelector] = useState(false);
  const queryClient = useQueryClient();
  
  const {
    offeredCards,
    wantedCards,
    removeOfferedCard,
    removeWantedCard,
    clearTradeForm,
  } = useTradesStore();

  const form = useForm<TradeForm>({
    resolver: zodResolver(tradeSchema),
    defaultValues: { message: '' },
  });

  const createTradeMutation = useMutation({
    mutationFn: tradesApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/trades'] });
      toast({
        title: "Trade created!",
        description: "Your trade has been posted to the marketplace.",
      });
      handleClose();
    },
    onError: (error: any) => {
      toast({
        title: "Failed to create trade",
        description: error.response?.data?.message || "Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: TradeForm) => {
    if (offeredCards.length === 0) {
      toast({
        title: "No cards offered",
        description: "Please select cards you're offering to trade.",
        variant: "destructive",
      });
      return;
    }

    if (wantedCards.length === 0) {
      toast({
        title: "No cards wanted",
        description: "Please select cards you want to receive.",
        variant: "destructive",
      });
      return;
    }

    createTradeMutation.mutate({
      message: data.message,
      offeredCards: offeredCards.map(({ card, quantity }) => ({
        cardId: card.id,
        quantity,
      })),
      wantedCards: wantedCards.map(({ card, quantity }) => ({
        cardId: card.id,
        quantity,
      })),
    });
  };

  const handleClose = () => {
    form.reset();
    clearTradeForm();
    onClose();
  };

  const placeholderImage = "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=140";

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Create New Trade</DialogTitle>
          </DialogHeader>

          <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Trade Message */}
              <div>
                <Label htmlFor="message" className="text-sm font-medium">
                  Trade Description
                </Label>
                <Textarea
                  id="message"
                  rows={3}
                  placeholder="Describe what you're looking for in this trade..."
                  {...form.register('message')}
                  className="mt-2 resize-none"
                />
                {form.formState.errors.message && (
                  <p className="text-sm text-red-500 mt-1">{form.formState.errors.message.message}</p>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Cards You're Offering */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Cards You're Offering</h3>
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 min-h-[200px]">
                    {offeredCards.length === 0 ? (
                      <div className="text-center text-gray-500 dark:text-gray-400 h-full flex flex-col items-center justify-center">
                        <Plus className="w-8 h-8 mb-2" />
                        <p>Click to select cards from your collection</p>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setShowOfferedSelector(true)}
                          className="mt-2"
                        >
                          Select Cards
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setShowOfferedSelector(true)}
                          className="w-full"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add More Cards
                        </Button>
                        {offeredCards.map(({ card, quantity }) => (
                          <div key={card.id} className="flex items-center space-x-3 p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <img
                              src={card.image || placeholderImage}
                              alt={card.name}
                              className="w-12 h-16 object-cover rounded"
                            />
                            <div className="flex-1">
                              <p className="font-medium text-sm">{card.name}</p>
                              <p className="text-xs text-gray-500">Qty: {quantity}</p>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeOfferedCard(card.id)}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Cards You Want */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Cards You Want</h3>
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 min-h-[200px]">
                    {wantedCards.length === 0 ? (
                      <div className="text-center text-gray-500 dark:text-gray-400 h-full flex flex-col items-center justify-center">
                        <Plus className="w-8 h-8 mb-2" />
                        <p>Search and select desired cards</p>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setShowWantedSelector(true)}
                          className="mt-2"
                        >
                          Select Cards
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setShowWantedSelector(true)}
                          className="w-full"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add More Cards
                        </Button>
                        {wantedCards.map(({ card, quantity }) => (
                          <div key={card.id} className="flex items-center space-x-3 p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <img
                              src={card.image || placeholderImage}
                              alt={card.name}
                              className="w-12 h-16 object-cover rounded"
                            />
                            <div className="flex-1">
                              <p className="font-medium text-sm">{card.name}</p>
                              <p className="text-xs text-gray-500">Qty: {quantity}</p>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeWantedCard(card.id)}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <Button type="button" variant="outline" onClick={handleClose}>
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={createTradeMutation.isPending}
                >
                  {createTradeMutation.isPending ? 'Creating...' : 'Create Trade'}
                </Button>
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>

      <CardSelectorModal
        isOpen={showOfferedSelector}
        onClose={() => setShowOfferedSelector(false)}
        mode="offered"
        title="Select Cards to Offer"
      />

      <CardSelectorModal
        isOpen={showWantedSelector}
        onClose={() => setShowWantedSelector(false)}
        mode="wanted"
        title="Select Cards You Want"
      />
    </>
  );
}
