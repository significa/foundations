import type { VariantProps } from 'cva';
import { Children, Fragment, isValidElement, useEffect } from 'react';
import { Slot, Slottable } from '@/foundations/components/slot/slot';
import { Spinner } from '@/foundations/ui/spinner/spinner';
import { cn, cva } from '@/lib/utils/classnames';
import { Divider } from '../divider/divider';

const buttonStyle = cva({
  base: [
    'relative inline-flex h-(--button-height) shrink-0 items-center justify-center gap-1.5 whitespace-nowrap font-medium text-(--button-text-color) shadow-xs [--button-text-color:var(--color-foreground)]',
    'transition enabled:cursor-pointer disabled:opacity-40',
    'active:not-in-data-ui-button-group:scale-98',
    'ring-ring focus-visible:outline-none focus-visible:ring-4',
    // inside button group
    'in-data-ui-button-group:not-last:rounded-r-none in-data-ui-button-group:not-last:border-r-0',
    'in-data-ui-button-group:not-first:rounded-l-none in-data-ui-button-group:not-first:border-l-0',
  ],
  variants: {
    variant: {
      primary:
        'bg-accent [--button-text-color:var(--color-accent-foreground)] hover:bg-accent/90 in-data-ui-button-group:active:bg-accent/80',
      outline:
        'border border-border bg-background hover:bg-foreground/2 not-in-data-ui-button-group:focus-visible:border-accent in-data-ui-button-group:active:bg-foreground/4',
      ghost:
        'border-none bg-transparent shadow-none ring-0 hover:bg-foreground/5 in-data-ui-button-group:active:bg-foreground/10',
      destructive:
        'bg-red-600 ring-red-600/50 [--button-text-color:var(--color-white)] hover:bg-red-700',
    },
    size: {
      xs: 'rounded-lg px-2 text-sm [--button-height:--spacing(6)]',
      sm: 'rounded-lg px-3 text-sm [--button-height:--spacing(8)]',
      md: 'rounded-xl px-4 text-base [--button-height:--spacing(10)]',
      lg: 'rounded-2xl px-5 text-base [--button-height:--spacing(12)]',
    },
    square: {
      true: 'w-(--button-height) px-0',
      false: '',
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'md',
  },
});

export interface ButtonProps
  extends React.ComponentPropsWithRef<'button'>,
    VariantProps<typeof buttonStyle> {
  asChild?: boolean;
  isLoading?: boolean;
}

const Button = ({
  children,
  className,
  variant,
  asChild = false,
  isLoading,
  size = 'md',
  square,
  type = 'button',
  ref,
  ...props
}: ButtonProps) => {
  const Comp = asChild ? Slot : 'button';

  return (
    <Comp
      className={cn(
        buttonStyle({
          className,
          variant,
          size,
          square,
        }),
        isLoading && 'text-transparent transition-none'
      )}
      ref={ref}
      type={type}
      {...props}
    >
      <Slottable asChild={asChild} child={children}>
        {(child) => (
          <>
            {child}
            {isLoading && (
              <span
                data-button-spinner
                className={cn(
                  'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
                  'text-(--button-text-color)'
                )}
              >
                <Spinner size={size} />
              </span>
            )}
          </>
        )}
      </Slottable>
    </Comp>
  );
};

export interface IconButtonProps extends Omit<ButtonProps, 'square'> {
  'aria-label': string;
}

const IconButton = ({ ref, ...props }: IconButtonProps) => {
  return <Button square {...props} ref={ref} />;
};

type ButtonGroupProps = React.ComponentPropsWithRef<'div'>;

const ButtonGroup = ({ className, children, ...props }: ButtonGroupProps) => {
  // Validate children to ensure they are Button or IconButton components
  useEffect(() => {
    const childArray = Children.toArray(children);
    childArray.forEach((child, index) => {
      if (
        !isValidElement(child) ||
        (child.type !== Button && child.type !== IconButton)
      ) {
        console.warn(
          `Warning: ButtonGroup child at index ${index} is not a Button or IconButton component.`
        );
      }
    });
  }, [children]);

  return (
    <div
      className={cn('flex items-center *:focus-visible:z-2', className)}
      data-ui-button-group
      {...props}
    >
      {Children.toArray(children).map((child, index) => {
        return (
          <Fragment key={index}>
            {index !== 0 && (
              <Divider
                orientation="vertical"
                className="z-1 -mr-px h-[1em] w-px"
              />
            )}
            {child}
          </Fragment>
        );
      })}
    </div>
  );
};

const CompoundButton = Object.assign(Button, {
  Group: ButtonGroup,
});

export { buttonStyle, CompoundButton as Button, IconButton };
