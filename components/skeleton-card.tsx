import { Skeleton } from "./ui/skeleton";

export function SkeletonCard() {
  return (
    <div className="flex flex-col rounded-2xl border-2 border-brand-ink/20 bg-brand-paper overflow-hidden shadow-cartoon-xs">
      <Skeleton className="w-full aspect-square rounded-none border-0 border-b-2 border-brand-ink/10" />
      <div className="px-2 py-2 flex flex-col gap-1.5">
        <Skeleton className="h-3 w-3/4 rounded-full border-0" />
        <Skeleton className="h-2.5 w-1/2 rounded-full border-0" />
      </div>
    </div>
  );
}

export function SkeletonTierRow() {
  return (
    <div className="flex gap-4 items-start">
      <Skeleton className="w-14 h-14 rounded-full flex-shrink-0 border-0" />
      <div className="w-px self-stretch bg-brand-sand flex-shrink-0" />
      <div className="flex-1 grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </div>
  );
}
