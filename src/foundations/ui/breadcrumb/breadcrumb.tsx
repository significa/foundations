import { CaretRightIcon, DotsThreeIcon } from '@phosphor-icons/react/dist/ssr';

import { Slot } from '@/foundations/components/slot/slot';
import { cn } from '@/lib/utils/classnames';

const Breadcrumb = ({
  ref,
  className,
  ...props
}: React.ComponentPropsWithRef<'nav'>) => {
  return (
    <nav
      ref={ref}
      aria-label="breadcrumb"
      className={cn('text-sm', className)}
      {...props}
    />
  );
};

const BreadcrumbList = ({
  ref,
  className,
  ...props
}: React.ComponentPropsWithRef<'ol'>) => {
  return (
    <ol
      ref={ref}
      className={cn(
        'wrap-break-word flex flex-wrap items-center gap-1.5 text-foreground-secondary sm:gap-2.5',
        className
      )}
      {...props}
    />
  );
};

const BreadcrumbItem = ({
  ref,
  className,
  ...props
}: React.ComponentPropsWithRef<'li'>) => {
  return (
    <li
      ref={ref}
      className={cn('inline-flex items-center gap-1.5', className)}
      {...props}
    />
  );
};

interface BreadcrumbLinkProps extends React.ComponentPropsWithRef<'a'> {
  asChild?: boolean;
}

const BreadcrumbLink = ({
  ref,
  className,
  asChild,
  ...props
}: BreadcrumbLinkProps) => {
  const Comp = asChild ? Slot : 'a';

  return (
    <Comp
      ref={ref}
      className={cn(
        'focus-visible:ring-(length:--ring-width) rounded-xs outline-none ring-ring transition hover:text-foreground',
        className
      )}
      {...props}
    />
  );
};

interface BreadcrumbPageProps extends React.ComponentPropsWithRef<'span'> {
  asChild?: boolean;
}

const BreadcrumbPage = ({
  ref,
  className,
  asChild,
  ...props
}: BreadcrumbPageProps) => {
  const Comp = asChild ? Slot : 'span';

  return (
    <Comp
      ref={ref}
      aria-current="page"
      className={cn('font-medium text-foreground', className)}
      {...props}
    />
  );
};

const BreadcrumbSeparator = ({
  className,
  children,
  ...props
}: React.ComponentPropsWithRef<'li'>) => {
  return (
    <li
      role="presentation"
      aria-hidden="true"
      className={cn('inline-flex items-center [&>svg]:size-3.5', className)}
      {...props}
    >
      {children ?? <CaretRightIcon />}
    </li>
  );
};

const BreadcrumbEllipsis = ({
  className,
  ...props
}: React.ComponentPropsWithRef<'span'>) => {
  return (
    <span
      role="presentation"
      aria-hidden="true"
      className={cn('flex size-5 items-center justify-center', className)}
      {...props}
    >
      <DotsThreeIcon className="size-4" />
    </span>
  );
};

const CompoundBreadcrumb = Object.assign(Breadcrumb, {
  List: BreadcrumbList,
  Item: BreadcrumbItem,
  Link: BreadcrumbLink,
  Page: BreadcrumbPage,
  Separator: BreadcrumbSeparator,
  Ellipsis: BreadcrumbEllipsis,
});

export { CompoundBreadcrumb as Breadcrumb };
