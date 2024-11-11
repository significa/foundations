import { cn } from '@/lib/tailwind';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return <div className={cn('bg-foreground/15 animate-pulse', className)} />;
}
