import type { VariantProps } from 'cva';
import {
  Children,
  createContext,
  isValidElement,
  use,
  useMemo,
  useRef,
} from 'react';
import { Slot } from '@/foundations/components/slot/slot';
import { composeRefs } from '@/foundations/utils/compose-refs/compose-refs';
import { cn, cva } from '@/lib/utils/classnames';

// Style for both input and input group
// ———
// Ideally we'd use a single composable variant combining :is() and :has() with arbitrary values
// (e.g. is-or-has-[input:focus-visible]) to handle both direct and descendant pseudo-state targeting.
// Tailwind doesn't support this yet, but we should be on the lookout for it and update the code when it does.
const inputStyle = cva({
  base: [
    'w-full',
    'font-medium [&,&_*]:placeholder:text-foreground-secondary',
    'border outline-none',
    'transition',
    // group
    'flex items-center',
    // focus-visible
    'ring-ring [:focus-visible,:has(:focus-visible)]:border-accent [:focus-visible,:has(:focus-visible)]:text-foreground [:focus-visible,:has(:focus-visible)]:ring-4', // disabled
    // disabled
    '[:disabled,:has(input:disabled)]:cursor-not-allowed [:disabled,:has(input:disabled)]:opacity-50',
    // invalid
    '[[data-invalid],:has([data-invalid])]:border-red-500! [[data-invalid],:has([data-invalid])]:ring-red-500/20 [[data-invalid],:has([data-invalid])]:hover:border-red-600',
    // variants
  ],
  variants: {
    variant: {
      default: [
        'border-border shadow-xs hover:border-[color-mix(in_oklab,var(--color-border),var(--color-foreground)_8%)]',
      ],
      minimal: [
        'border-transparent bg-transparent hover:bg-background-secondary [:focus-visible,:has(:focus-visible)]:bg-background',
      ],
    },
    size: {
      xs: ['h-6 gap-1 px-2', 'rounded-lg text-sm'],
      sm: ['h-8 gap-1 px-3', 'rounded-lg text-sm'],
      md: ['h-10 gap-2 px-4 py-1', 'rounded-xl text-base'],
      lg: ['h-12 gap-2 px-5 py-1', 'rounded-2xl text-base'],
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'md',
  },
});

const inputInGroupStyle = cva({
  base: ['h-full w-full min-w-8 cursor-[inherit] outline-none'],
});

const InputGroupContext = createContext<null | true>(null);

// We need to determine if the input is inside a group to apply the correct styles. This hook abstracts that logic.
const useInputStyle = (
  props: VariantProps<typeof inputStyle> & { className?: string }
) => {
  const inGroup = use(InputGroupContext);
  return inGroup ? inputInGroupStyle(props) : inputStyle(props);
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

const InputGroup = ({
  className,
  style,
  children,
  onClick,
  ...props
}: React.ComponentPropsWithRef<'div'>) => {
  // We need to extract the variant and size from the child Input to apply it to the group container for consistent styling.
  const { variant, size } = useMemo(() => {
    const inputChild = Children.toArray(children).find(
      (child) => isValidElement(child) && child.type === Input
    ) as React.ReactElement<InputProps> | undefined;

    const inputProps = inputChild ? (inputChild.props as InputProps) : null;

    return { variant: inputProps?.variant, size: inputProps?.size };
  }, [children]);

  const handleGroupClick = (e: React.MouseEvent<HTMLDivElement>) => {
    onClick?.(e);

    // If the click is on the group container (not on an input or addon), focus the first input child
    if (!e.defaultPrevented && e.target === e.currentTarget) {
      const firstInput = e.currentTarget.querySelector('input');
      firstInput?.focus();
    }
  };

  return (
    <InputGroupContext value={true}>
      {/** biome-ignore lint/a11y/useKeyWithClickEvents: intentional */}
      {/** biome-ignore lint/a11y/noStaticElementInteractions: intentional */}
      <div
        data-ui-input-group
        className={inputStyle({
          variant,
          size,
          className,
        })}
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

const InputAddon = ({ ref, className, asChild, ...props }: InputAddonProps) => {
  const Comp = asChild ? Slot : 'div';
  const internalRef = useRef<HTMLDivElement | null>(null);

  return (
    <Comp
      data-input-addon
      className={cn(
        'pointer-events-none flex shrink-0 items-center justify-center',
        'first:-ml-0.5 last:-mr-0.5',
        className
      )}
      ref={composeRefs(ref, internalRef)}
      {...props}
    />
  );
};

const CompoundInput = Object.assign(Input, {
  Group: InputGroup,
  Addon: InputAddon,
});

export { CompoundInput as Input, inputStyle, useInputStyle };
