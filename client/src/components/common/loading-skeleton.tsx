import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';

export function CardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <Skeleton className="h-48 w-full" />
      <CardContent className="p-4">
        <Skeleton className="h-4 w-3/4 mb-2" />
        <Skeleton className="h-3 w-1/2 mb-3" />
        <div className="flex justify-between items-center">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-8 w-20" />
        </div>
      </CardContent>
    </Card>
  );
}

export function TradeSkeleton() {
  return (
    <Card className="p-6">
      <div className="flex items-center space-x-3 mb-3">
        <Skeleton className="w-10 h-10 rounded-full" />
        <div>
          <Skeleton className="h-4 w-24 mb-1" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
      <Skeleton className="h-4 w-3/4 mb-4" />
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Skeleton className="h-4 w-16 mb-2" />
          <div className="flex space-x-2">
            <Skeleton className="w-12 h-16 rounded-lg" />
            <Skeleton className="w-12 h-16 rounded-lg" />
          </div>
        </div>
        <div>
          <Skeleton className="h-4 w-16 mb-2" />
          <div className="flex space-x-2">
            <Skeleton className="w-12 h-16 rounded-lg" />
            <Skeleton className="w-12 h-16 rounded-lg" />
          </div>
        </div>
      </div>
    </Card>
  );
}
