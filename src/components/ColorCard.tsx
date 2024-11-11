import type { ReactNode } from 'react';
import { cn } from '@/lib/tailwind';

type ColorCardProps = {
  token: 'background' | 'primary' | 'accent';
  className?: string;
  children?: ReactNode;
};

export function ColorCard({ token, className, children }: ColorCardProps) {
  return (
    <div
      className={cn(
        'relative w-full pb-[75%] nx-rounded-xl',
        token === 'background' && 'bg-background',
        token === 'primary' && 'bg-primary',
        token === 'accent' && 'bg-accent',
        className
      )}
    >
      <span className="absolute top-0 left-0 text-md font-medium leading-none p-5">{children}</span>
    </div>
  );
}
