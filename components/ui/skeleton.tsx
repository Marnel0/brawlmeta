import { cn } from "@/lib/utils";

export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-2xl bg-brand-sand border-2 border-brand-ink/20",
        className
      )}
      {...props}
    />
  );
}
