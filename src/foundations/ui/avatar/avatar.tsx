import { UserIcon } from '@phosphor-icons/react';
import type { VariantProps } from 'cva';

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
  base: [
    'relative flex items-center justify-center overflow-hidden bg-foreground-secondary/10 font-semibold text-foreground/80 shadow-[inset_0_0_0_1px_--alpha(var(--color-foreground)/8%)] backdrop-blur-sm',
    'size-[calc(var(--radius)*2)]',
    'in-data-ui-avatar-group:not-first:-ml-(--overlap) [--border:--spacing(0.5)] [--overlap:--spacing(3)]',
  ],
  variants: {
    variant: {
      circle: [
        'rounded-full',
        '[&+div]:in-data-ui-avatar-group:not-first:mask-[radial-gradient(circle_at_calc(-50%+var(--overlap)+(-1*(var(--prev-radius)-var(--radius))))_50%,transparent_calc(var(--prev-radius)+var(--border)),black_0%)]',
      ],
      square: [
        'rounded-md',
        '[&+div]:in-data-ui-avatar-group:not-first:[clip-path:inset(0_0_0_calc(var(--overlap)+var(--border)))]',
      ],
    },
    size: {
      '2xs':
        'text-2xs [--radius:--spacing(2)] [&+*]:[--prev-radius:--spacing(2)]',
      xs: 'text-2xs [--radius:--spacing(3)] [&+*]:[--prev-radius:--spacing(3)]',
      sm: 'text-xs [--radius:--spacing(4)] [&+*]:[--prev-radius:--spacing(4)]',
      md: 'text-sm [--radius:--spacing(5)] [&+*]:[--prev-radius:--spacing(5)]',
      lg: 'text-base [--radius:--spacing(6)] [&+*]:[--prev-radius:--spacing(6)]',
      xl: 'text-lg [--radius:--spacing(7)] [&+*]:[--prev-radius:--spacing(7)]',
      '2xl':
        'text-xl [--radius:--spacing(8)] [&+*]:[--prev-radius:--spacing(8)]',
      '3xl':
        'text-3xl [--radius:--spacing(10)] [&+*]:[--prev-radius:--spacing(10)]',
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

interface AvatarGroupProps extends React.ComponentPropsWithRef<'div'> {
  children: React.ReactNode;
}

const AvatarGroup = ({ className, children }: AvatarGroupProps) => {
  return (
    <div className={cn('flex items-center', className)} data-ui-avatar-group>
      {children}
    </div>
  );
};

const CompoundAvatar = Object.assign(Avatar, {
  Image: AvatarImage,
  Fallback: AvatarFallback,
  Group: AvatarGroup,
});

export { CompoundAvatar as Avatar };
