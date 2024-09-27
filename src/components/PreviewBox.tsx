import { cn } from 'lib/tailwind';

interface PreviewBoxProps extends React.HTMLAttributes<HTMLDivElement> {}

export function PreviewBox({ className, children }: PreviewBoxProps) {
  return (
    <div
      className={cn(
        'relative w-full h-[24rem] p-10 mt-6 first:mt-0 nx-rounded-xl flex justify-center items-center overflow-hidden nx-bg-primary-700/5 dark:nx-bg-primary-300/10',
        className
      )}
    >
      {children}
    </div>
  );
}
