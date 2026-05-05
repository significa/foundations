import { UserIcon } from '@phosphor-icons/react/dist/ssr';
import type { VariantProps } from 'cva';
import { Children, cloneElement, isValidElement, useId } from 'react';
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

const OVERLAP_UNITS = 2;
const CUTOUT_GAP_UNITS = 1;
const SQUARE_RADIUS_UNITS = 1.5;

const toPathNumber = (value: number) => {
  return Number(value.toFixed(4));
};

const createCirclePath = ({
  cx,
  cy,
  radius,
}: {
  cx: number;
  cy: number;
  radius: number;
}) => {
  const left = toPathNumber(cx - radius);
  const right = toPathNumber(cx + radius);
  const centerY = toPathNumber(cy);
  const pathRadius = toPathNumber(radius);

  return [
    `M ${left} ${centerY}`,
    `A ${pathRadius} ${pathRadius} 0 1 0 ${right} ${centerY}`,
    `A ${pathRadius} ${pathRadius} 0 1 0 ${left} ${centerY}`,
    'Z',
  ].join(' ');
};

const createRoundedRectPath = ({
  x,
  y,
  width,
  height,
  radius,
}: {
  x: number;
  y: number;
  width: number;
  height: number;
  radius: number;
}) => {
  const right = x + width;
  const bottom = y + height;
  const pathRadius = Math.min(radius, width / 2, height / 2);

  return [
    `M ${toPathNumber(x + pathRadius)} ${toPathNumber(y)}`,
    `H ${toPathNumber(right - pathRadius)}`,
    `A ${toPathNumber(pathRadius)} ${toPathNumber(pathRadius)} 0 0 1 ${toPathNumber(right)} ${toPathNumber(y + pathRadius)}`,
    `V ${toPathNumber(bottom - pathRadius)}`,
    `A ${toPathNumber(pathRadius)} ${toPathNumber(pathRadius)} 0 0 1 ${toPathNumber(right - pathRadius)} ${toPathNumber(bottom)}`,
    `H ${toPathNumber(x + pathRadius)}`,
    `A ${toPathNumber(pathRadius)} ${toPathNumber(pathRadius)} 0 0 1 ${toPathNumber(x)} ${toPathNumber(bottom - pathRadius)}`,
    `V ${toPathNumber(y + pathRadius)}`,
    `A ${toPathNumber(pathRadius)} ${toPathNumber(pathRadius)} 0 0 1 ${toPathNumber(x + pathRadius)} ${toPathNumber(y)}`,
    'Z',
  ].join(' ');
};

const createAvatarCutoutPath = ({
  previousVariant,
  previousSize,
  currentSize,
}: {
  previousVariant: NonNullable<AvatarProps['variant']>;
  previousSize: NonNullable<AvatarProps['size']>;
  currentSize: NonNullable<AvatarProps['size']>;
}) => {
  const previousUnits = SIZE_MAP[previousSize];
  const currentUnits = SIZE_MAP[currentSize];
  const gap = CUTOUT_GAP_UNITS / currentUnits;
  const previousWidth = previousUnits / currentUnits;
  const previousCenterX = (OVERLAP_UNITS - previousUnits / 2) / currentUnits;
  const previousCenterY = 0.5;

  const cutout =
    previousVariant === 'circle'
      ? createCirclePath({
          cx: previousCenterX,
          cy: previousCenterY,
          radius: previousWidth / 2 + gap,
        })
      : createRoundedRectPath({
          x: (OVERLAP_UNITS - previousUnits - CUTOUT_GAP_UNITS) / currentUnits,
          y: (currentUnits - previousUnits) / 2 / currentUnits - gap,
          width: (previousUnits + CUTOUT_GAP_UNITS * 2) / currentUnits,
          height: (previousUnits + CUTOUT_GAP_UNITS * 2) / currentUnits,
          radius: (SQUARE_RADIUS_UNITS + CUTOUT_GAP_UNITS) / currentUnits,
        });

  return `M 0 0 H 1 V 1 H 0 Z ${cutout}`;
};

const cloneAvatarForGroup = (child: React.ReactElement<AvatarProps>) => {
  return cloneElement(child, {
    className: cn(child.props.className, 'backdrop-blur-none'),
  });
};

type AvatarGroupProps = React.ComponentPropsWithRef<'div'>;

const AvatarGroup = ({ children, className, ...props }: AvatarGroupProps) => {
  const id = useId();
  const items = Children.toArray(children).filter(
    (child): child is React.ReactElement<AvatarProps> =>
      isValidElement(child) && child.type === Avatar
  );

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

        if (!previous) return cloneAvatarForGroup(child);

        const clipPathId = `${id}-${i}`;
        const previousVariant = previous.props.variant ?? 'circle';
        const previousSize = previous.props.size ?? 'md';
        const currentSize = child.props.size ?? 'md';
        const cutoutPath = createAvatarCutoutPath({
          currentSize,
          previousSize,
          previousVariant,
        });

        return (
          <div
            key={key}
            className="relative"
            style={{
              clipPath: `url(#${clipPathId})`,
              WebkitClipPath: `url(#${clipPathId})`,
            }}
          >
            <svg
              width="0"
              height="0"
              className="absolute size-0 overflow-hidden"
              aria-hidden="true"
              focusable="false"
            >
              <clipPath id={clipPathId} clipPathUnits="objectBoundingBox">
                <path clipRule="evenodd" fillRule="evenodd" d={cutoutPath} />
              </clipPath>
            </svg>

            {cloneAvatarForGroup(child)}
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
