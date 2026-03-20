import { cva } from '@/lib/utils/classnames';

const radioStyle = cva({
  base: [
    'relative flex size-5 shrink-0 appearance-none items-center justify-center rounded-full border border-border bg-background shadow-xs outline-none ring-ring transition focus-visible:ring-4 enabled:cursor-pointer enabled:not-checked:hover:border-mix-border/8',
    // checked
    'checked:enabled:hover:mix-with-accent-foreground checked:enabled:border-accent checked:enabled:bg-accent checked:enabled:hover:border-mix-accent/8',
    // checked circle
    'checked:before:absolute checked:before:h-1.5 checked:before:w-1.5 checked:before:rounded-full checked:before:bg-accent-foreground',
    // disabled
    'disabled:cursor-not-allowed disabled:border-foreground/5 disabled:bg-foreground/10 disabled:checked:before:bg-foreground/50',
  ],
});

const Radio = ({
  className,
  ...props
}: Omit<React.ComponentPropsWithRef<'input'>, 'type'>) => {
  return (
    <input type="radio" className={radioStyle({ className })} {...props} />
  );
};

export { Radio };
