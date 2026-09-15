import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex flex-col min-h-screen">
      <Skeleton className="w-full h-[70vh]" />
      <div className="container mx-auto px-4 py-12 space-y-16">
        <div className="space-y-6">
          <Skeleton className="h-8 w-48" />
          <div className="flex gap-4 overflow-hidden">
            {[1, 2, 3, 4, 5].map(i => (
              <Skeleton key={i} className="h-64 min-w-[200px] rounded-xl" />
            ))}
          </div>
        </div>
        <div className="space-y-6">
          <Skeleton className="h-8 w-48" />
          <div className="flex gap-4 overflow-hidden">
            {[1, 2, 3, 4, 5].map(i => (
              <Skeleton key={i} className="h-64 min-w-[200px] rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
