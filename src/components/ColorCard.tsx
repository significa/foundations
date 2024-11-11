import type { ReactNode } from 'react';
import { cn } from '@/lib/tailwind';

type ColorCardProps = {
  className?: string;
  children?: ReactNode;
};

export function ColorCard({ className, children }: ColorCardProps) {
  return (
    <div className={cn('relative w-full pb-[75%] nx-rounded-xl bg-foreground', className)}>
      <span className="absolute top-0 left-0 text-md font-medium leading-none p-5">{children}</span>
    </div>
  );
}
