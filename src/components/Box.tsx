import { cn } from '@/lib/tailwind';

type BoxProps = React.HTMLAttributes<HTMLDivElement>;

export function Box({ className, children }: BoxProps) {
  return (
    <div
      className={cn(
        'relative w-full h-[--box-height] mt-6 first:mt-0 p-12 nx-rounded-xl flex justify-center items-center overflow-hidden nx-bg-primary-700/5 dark:nx-bg-primary-300/10',
        className
      )}
    >
      {children}
    </div>
  );
}
