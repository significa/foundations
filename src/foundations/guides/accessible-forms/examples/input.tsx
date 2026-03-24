import type { VariantProps } from 'cva';

import { cn, cva } from '@/lib/utils/classnames';

import { useField } from '../field';

const inputStyle = cva({
  base: [
    'transition',
    'h-10 w-full rounded-xl border px-4 py-1 font-medium text-base',
    'text-foreground/80 placeholder:text-foreground-secondary focus:outline-none focus-visible:border-foreground/20 focus-visible:text-foreground focus-visible:ring-4 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-invalid:border-red-500 data-invalid:focus-visible:border-red-500 data-invalid:focus-visible:ring-red-500/20 data-invalid:hover:border-red-600',
  ],
  variants: {
    variant: {
      default: 'border-border bg-background shadow-xs hover:border-border-hard',
      minimal:
        'border-transparent bg-transparent hover:bg-background-secondary focus-visible:bg-background',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

interface InputProps
  extends Omit<React.ComponentPropsWithRef<'input'>, 'size'> {
  invalid?: boolean;
  variant?: VariantProps<typeof inputStyle>['variant'];
}

const Input = ({
  className,
  invalid: propsInvalid,
  variant,
  id,
  ...props
}: InputProps) => {
  const fieldCtx = useField();

  const invalid =
    propsInvalid || !!fieldCtx?.['aria-errormessage'] || undefined;

  return (
    <input
      id={id ?? fieldCtx?.id}
      aria-errormessage={fieldCtx?.['aria-errormessage']}
      aria-describedby={fieldCtx?.['aria-describedby']}
      aria-labelledby={fieldCtx?.['aria-labelledby']}
      data-invalid={invalid}
      aria-invalid={invalid}
      className={cn(
        inputStyle({ variant }),
        props.type === 'number' && [
          '[&::-webkit-inner-spin-button]:hidden',
          '[&::-webkit-outer-spin-button]:hidden',
          '[appearance:textfield]',
        ],
        className
      )}
      {...props}
    />
  );
};

export { Input, inputStyle };
