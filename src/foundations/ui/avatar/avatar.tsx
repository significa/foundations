import { UserIcon } from '@phosphor-icons/react/dist/ssr';
import type { VariantProps } from 'cva';
import { Children, Fragment, isValidElement, useId } from 'react';
import { cn, cva } from '@/lib/utils/classnames';

const getInitials = (name: string | undefined) => {
  if (!name) return '';

  if (name.length === 1 || name.length === 2) return name;

  return name
    .split(' ')
    .map((n) => n[0])
    .join('');
};

const avatarStyle = cva({
  base: 'relative flex items-center justify-center overflow-hidden bg-foreground-secondary/10 font-semibold text-foreground/80 shadow-[inset_0_0_0_1px_--alpha(var(--color-foreground)/8%)] backdrop-blur-sm',
  variants: {
    variant: {
      circle: 'rounded-full',
      square: 'rounded-md',
    },
    size: {
      '2xs': 'size-4 text-2xs',
      xs: 'size-6 text-2xs',
      sm: 'size-8 text-xs',
      md: 'size-10 text-sm',
      lg: 'size-12 text-base',
      xl: 'size-14 text-lg',
      '2xl': 'size-16 text-xl',
      '3xl': 'size-20 text-3xl',
    },
  },
});

interface AvatarProps extends React.ComponentPropsWithRef<'div'> {
  size?: VariantProps<typeof avatarStyle>['size'];
  variant?: VariantProps<typeof avatarStyle>['variant'];
}

const Avatar = ({
  className,
  variant = 'circle',
  size = 'md',
  children,
  ...props
}: AvatarProps) => {
  return (
    <div className={cn(avatarStyle({ variant, size }), className)} {...props}>
      {children}
    </div>
  );
};

interface AvatarImageProps extends React.ComponentPropsWithRef<'img'> {
  src: string;
}

const AvatarImage = ({ className, src, ...props }: AvatarImageProps) => {
  return (
    <img
      className={cn('absolute inset-0 z-1 object-cover', className)}
      src={src}
      alt=""
      {...props}
    />
  );
};

interface AvatarFallbackProps extends React.ComponentPropsWithRef<'div'> {
  children?: string;
}

const AvatarFallback = ({
  className,
  children,
  ...props
}: AvatarFallbackProps) => {
  return (
    <div className={cn('opacity-80', className)} {...props}>
      {getInitials(children) || <UserIcon weight="bold" />}
    </div>
  );
};

// Tailwind spacing units for each Avatar size variant; `2xs` (size-4) is 4 spacing units, etc.
// Kept in sync with `avatarStyle.variants.size` via the `satisfies` constraint below.
const SIZE_MAP = {
  '2xs': 4,
  xs: 6,
  sm: 8,
  md: 10,
  lg: 12,
  xl: 14,
  '2xl': 16,
  '3xl': 20,
} as const satisfies Record<NonNullable<AvatarProps['size']>, number>;

const MASK_SHAPE_PROPS = {
  fill: 'black',
  stroke: 'black',
  style: {
    strokeWidth: 'var(--overlap)',
    transform: 'translate(var(--overlap), 0)',
  },
};

type AvatarGroupProps = React.ComponentPropsWithRef<'div'>;

const AvatarGroup = ({ children, className, ...props }: AvatarGroupProps) => {
  const id = useId();
  const items = Children.toArray(children).filter(
    (child): child is React.ReactElement<AvatarProps> =>
      isValidElement(child) && child.type === Avatar
  );

  const toPercentage = (n: number) => `${n * 100}%`;

  return (
    <div
      className={cn(
        'isolate flex items-center -space-x-(--overlap) [--overlap:--spacing(2)]',
        className
      )}
      {...props}
    >
      {items.map((child, i) => {
        const key = child.key ?? i;
        const previous = items[i - 1];
        if (!previous) return <Fragment key={key}>{child}</Fragment>;

        const maskId = `${id}-${i}`;
        const previousVariant = previous.props.variant ?? 'circle';
        const previousSize = previous.props.size ?? 'md';
        const currentSize = child.props.size ?? 'md';
        const ratio = SIZE_MAP[previousSize] / SIZE_MAP[currentSize];

        return (
          <div
            key={key}
            className="*:mask-(--mask) relative"
            style={{ '--mask': `url(#${maskId})` }}
          >
            <svg
              width="100%"
              height="100%"
              className="absolute"
              aria-hidden="true"
            >
              <mask id={maskId}>
                <rect width="100%" height="100%" fill="white" />
                {previousVariant === 'circle' ? (
                  <circle
                    cx={toPercentage(-0.5 * ratio)}
                    cy={toPercentage(0.5)}
                    r={toPercentage(ratio / 2)}
                    {...MASK_SHAPE_PROPS}
                  />
                ) : (
                  <rect
                    x={toPercentage(-ratio)}
                    y={toPercentage(-0.5 * (ratio - 1))}
                    width={toPercentage(ratio)}
                    height={toPercentage(ratio)}
                    rx="6"
                    {...MASK_SHAPE_PROPS}
                  />
                )}
              </mask>
            </svg>
            {child}
          </div>
        );
      })}
    </div>
  );
};

const CompoundAvatar = Object.assign(Avatar, {
  Image: AvatarImage,
  Fallback: AvatarFallback,
  Group: AvatarGroup,
});

export { CompoundAvatar as Avatar };
