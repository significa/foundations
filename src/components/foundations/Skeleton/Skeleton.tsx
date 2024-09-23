import { cn } from 'lib/tailwind';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return <div className={cn('bg-primary/15 animate-pulse', className)} />;
}
