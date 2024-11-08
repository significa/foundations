import { cn } from '@/lib/tailwind';

export const Box = ({ className, children }: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={cn(
        'relative w-full h-[--box-height] mt-6 first:mt-0 nx-rounded-xl flex justify-center items-center overflow-hidden nx-bg-primary-700/5 dark:nx-bg-primary-300/10',
        className
      )}
    >
      {children}
    </div>
  );
};
