import { useContext, useMemo, Children, forwardRef, createContext, isValidElement } from 'react';
import { Slot, Slottable } from '@radix-ui/react-slot';
import { cn, cnva } from 'lib/tailwind';
import type { ButtonHTMLAttributes, HTMLAttributes } from 'react';
import type { VariantProps } from 'class-variance-authority';
import { Spinner } from 'components/foundations/Spinner';

const buttonStyle = cnva(
  `
  relative
  inline-flex
  items-center
  justify-center
  gap-1.5
  
  font-medium 
  transition
  
  disabled:opacity-60
  disabled:cursor-not-allowed

  focus-visible:ring 
  focus-visible:ring-accent/50
  focus-visible:ring-offset-accent
  `,
  {
    variants: {
      variant: {
        primary:
          'bg-primary border border-transparent text-background enabled:hover:bg-primary/95 enabled:active:bg-primary/90',
        secondary:
          'bg-transparent border border-primary/50 text-primary enabled:hover:bg-primary/5 enabled:active:bg-primary/10',
        ghost:
          'bg-transparent border border-transparent text-primary enabled:hover:bg-primary/5 enabled:hover:opacity-90 enabled:active:bg-primary/10'
      },
      size: {
        md: 'h-10 rounded-xl px-4 text-md',
        sm: 'h-8 rounded-lg px-2 text-sm'
      },
      square: {
        true: '',
        false: ''
      }
    },
    compoundVariants: [
      {
        size: 'md',
        square: true,
        className: 'w-10 px-0'
      },
      {
        size: 'sm',
        square: true,
        className: 'w-8 px-0'
      }
    ],
    defaultVariants: {
      variant: 'primary',
      size: 'md'
    }
  }
);

const ButtonContext = createContext<{ loading?: boolean }>({});

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    Omit<VariantProps<typeof buttonStyle>, 'square'> {
  loading?: boolean;
  asChild?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function (
  {
    variant = 'primary',
    size = 'md',
    className,
    loading,
    asChild,
    children,
    ...props
  }: ButtonProps,
  forwardedRef
) {
  const Component = asChild ? Slot : 'button';

  const [hasIcon, hasOnlyIcon] = useMemo(() => {
    const containsIcon = Children.toArray(children).some((child) => {
      return isValidElement(child) && child.type === ButtonIcon;
    });

    return [containsIcon, containsIcon && Children.toArray(children).length === 1];
  }, [children]);

  return (
    <ButtonContext.Provider value={{ loading }}>
      <Component
        ref={forwardedRef}
        className={buttonStyle({
          variant,
          size,
          square: hasOnlyIcon,
          className: [
            className,
            loading && !hasIcon && '[&>*:not([data-button-icon]]:opacity-0 !text-transparent'
          ]
        })}
        {...props}
      >
        <Slottable>{children}</Slottable>
        {loading && !hasIcon && (
          <span
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            data-button-icon
          >
            <Spinner className="text-white size-[1em]" />
          </span>
        )}
      </Component>
    </ButtonContext.Provider>
  );
});

export const ButtonIcon = forwardRef<HTMLSpanElement, HTMLAttributes<HTMLSpanElement>>(function (
  { className, children, ...props },
  forwardedRef
) {
  const ctx = useContext(ButtonContext);

  if (!ctx) {
    throw new Error('ButtonIcon must be used within a Button');
  }

  const { loading } = ctx;

  return (
    <span ref={forwardedRef} className={cn('[&>svg]:size-[1em]', className)} {...props}>
      {loading ? <Spinner /> : children}
    </span>
  );
});
