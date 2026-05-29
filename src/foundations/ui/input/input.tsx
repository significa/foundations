import type { VariantProps } from 'cva';
import { createContext, use, useRef } from 'react';
import { Slot } from '@/foundations/components/slot/slot';
import { composeRefs } from '@/foundations/utils/compose-refs/compose-refs';
import { cn, cva } from '@/lib/utils/classnames';

const inputFrameBase = [
  'w-full',
  'font-medium [&,&_*]:placeholder:text-foreground-secondary',
  'border outline-none',
  'transition',
  'flex items-center',
  '[:focus-visible,:has(:focus-visible)]:ring-(length:--ring-width) ring-ring [:focus-visible,:has(:focus-visible)]:border-accent [:focus-visible,:has(:focus-visible)]:text-foreground',
  '[:disabled,:has(input:disabled)]:cursor-not-allowed [:disabled,:has(input:disabled)]:opacity-50',
  '[[data-invalid],:has([data-invalid])]:border-error! [[data-invalid],:has([data-invalid])]:ring-error/20 [[data-invalid],:has([data-invalid])]:hover:border-error',
];

const inputFrameVariants = {
  default: [
    'border-border shadow-xs hover:border-[color-mix(in_oklab,var(--color-border),var(--color-foreground)_8%)]',
  ],
  minimal: [
    'border-transparent bg-transparent hover:bg-background-secondary [:focus-visible,:has(:focus-visible)]:bg-background',
  ],
};

const inputFrameSize = {
  xs: 'h-6 rounded-lg text-sm',
  sm: 'h-8 rounded-lg text-sm',
  md: 'h-10 py-(--inset) rounded-xl text-base',
  lg: 'h-12 py-(--inset) rounded-2xl text-base',
};

const inputElementStyles = [
  'file:mr-3 file:inline-flex file:h-full file:items-center file:cursor-pointer file:border-0 file:bg-transparent file:p-0 file:font-medium file:text-foreground',
  '[&::-webkit-calendar-picker-indicator]:hidden',
  '[&[type=date],&[type=time],&[type=datetime-local],&[type=month],&[type=week],&[type=file]]:py-0',
];

const inputHorizontalPaddingBySize = {
  xs: 'gap-1 px-2',
  sm: 'gap-1 px-3',
  md: 'gap-2 px-4',
  lg: 'gap-2 px-5',
};

const inputStyle = cva({
  base: [...inputFrameBase, ...inputElementStyles],
  variants: {
    variant: inputFrameVariants,
    size: {
      xs: cn(inputFrameSize.xs, inputHorizontalPaddingBySize.xs),
      sm: cn(inputFrameSize.sm, inputHorizontalPaddingBySize.sm),
      md: cn(inputFrameSize.md, inputHorizontalPaddingBySize.md),
      lg: cn(inputFrameSize.lg, inputHorizontalPaddingBySize.lg),
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'md',
  },
});

const inputGroupStyle = cva({
  base: inputFrameBase,
  variants: {
    variant: inputFrameVariants,
    size: inputFrameSize,
  },
  defaultVariants: {
    variant: 'default',
    size: 'md',
  },
});

const inputInGroupStyle = cva({
  base: [
    'h-full w-full min-w-8 cursor-[inherit] outline-none',
    ...inputElementStyles,
  ],
  variants: {
    size: {
      xs: 'px-2 [&:has(+[data-input-addon])]:pr-1 [[data-input-addon]+&]:pl-1',
      sm: 'px-3 [&:has(+[data-input-addon])]:pr-2 [[data-input-addon]+&]:pl-2',
      md: 'px-4 [&:has(+[data-input-addon])]:pr-3 [[data-input-addon]+&]:pl-3',
      lg: 'px-5 [&:has(+[data-input-addon])]:pr-4 [[data-input-addon]+&]:pl-4',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

const inputAddonStyle = cva({
  base: ['flex h-full shrink-0 items-center justify-center'],
  variants: {
    size: {
      xs: 'first:pl-2 last:pr-2',
      sm: 'first:pl-3 last:pr-3',
      md: 'first:pl-4 last:pr-4',
      lg: 'first:pl-5 last:pr-5',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

export type InputSize = 'xs' | 'sm' | 'md' | 'lg';
export type InputVariant = 'default' | 'minimal';

interface InputGroupContextValue {
  size: InputSize;
  variant: InputVariant;
}

const InputGroupContext = createContext<InputGroupContextValue | null>(null);

const useInputStyle = (
  props: VariantProps<typeof inputStyle> & { className?: string }
) => {
  const ctx = use(InputGroupContext);
  if (ctx) {
    return inputInGroupStyle({ size: ctx.size });
  }
  return inputStyle(props);
};

interface InputProps
  extends Omit<React.ComponentPropsWithRef<'input'>, 'size'>,
    VariantProps<typeof inputStyle> {
  invalid?: boolean;
}

const Input = ({ className, invalid, size, variant, ...props }: InputProps) => {
  return (
    <input
      data-invalid={invalid}
      aria-invalid={invalid}
      className={cn(useInputStyle({ variant, size }), className)}
      {...props}
    />
  );
};

interface InputGroupProps
  extends React.ComponentPropsWithRef<'div'>,
    VariantProps<typeof inputGroupStyle> {}

const InputGroup = ({
  className,
  size = 'md',
  variant = 'default',
  children,
  onClick,
  ...props
}: InputGroupProps) => {
  const handleGroupClick = (e: React.MouseEvent<HTMLDivElement>) => {
    onClick?.(e);

    // If the click is on the group container (not on an input or addon), focus the first input child.
    if (!e.defaultPrevented && e.target === e.currentTarget) {
      const firstInput = e.currentTarget.querySelector('input');
      firstInput?.focus();
    }
  };

  return (
    <InputGroupContext
      value={{ size: size ?? 'md', variant: variant ?? 'default' }}
    >
      {/** biome-ignore lint/a11y/useKeyWithClickEvents: intentional */}
      {/** biome-ignore lint/a11y/noStaticElementInteractions: intentional */}
      <div
        data-ui-input-group
        className={inputGroupStyle({ variant, size, className })}
        onClick={handleGroupClick}
        {...props}
      >
        {children}
      </div>
    </InputGroupContext>
  );
};

interface InputAddonProps extends React.ComponentPropsWithRef<'div'> {
  asChild?: boolean;
}

const InputAddon = ({
  ref,
  className,
  asChild,
  onClick,
  ...props
}: InputAddonProps) => {
  const ctx = use(InputGroupContext);
  const Comp = asChild ? Slot : 'div';
  const internalRef = useRef<HTMLDivElement | null>(null);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    onClick?.(e);
    if (e.defaultPrevented) return;
    const target = e.target as HTMLElement;
    if (
      target.closest(
        'button, a, input, select, textarea, [role="button"], [role="link"], [role="combobox"], [role="menuitem"], [role="checkbox"], [role="radio"], [role="switch"], [role="tab"]'
      )
    ) {
      return;
    }
    const group = e.currentTarget.closest<HTMLElement>('[data-ui-input-group]');
    const focusable = group?.querySelector<HTMLElement>(
      'input, textarea, select'
    );
    focusable?.focus();
  };

  return (
    <Comp
      data-input-addon
      className={cn(inputAddonStyle({ size: ctx?.size }), className)}
      ref={composeRefs(ref, internalRef)}
      onClick={handleClick}
      {...props}
    />
  );
};

const CompoundInput = Object.assign(Input, {
  Group: InputGroup,
  Addon: InputAddon,
});

export type { InputGroupProps, InputProps };
export { CompoundInput as Input, inputStyle, useInputStyle };
