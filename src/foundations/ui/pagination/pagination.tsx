import {
  CaretLeftIcon,
  CaretRightIcon,
  DotsThreeIcon,
} from '@phosphor-icons/react/dist/ssr';
import { useMemo } from 'react';

import { Slot, Slottable } from '@/foundations/components/slot/slot';
import { cn, cva } from '@/lib/utils/classnames';

const paginationLinkStyle = cva({
  base: [
    'inline-flex h-(--pagination-height) min-w-(--pagination-height) shrink-0 items-center justify-center px-2',
    'rounded-lg font-medium text-foreground-secondary text-sm',
    'transition enabled:cursor-pointer disabled:opacity-40',
    'hover:bg-foreground/5 hover:text-foreground',
    'focus-visible:ring-(length:--ring-width) outline-none ring-ring',
    'data-selected:bg-accent data-selected:text-accent-foreground data-selected:hover:bg-accent/90',
  ],
  variants: {
    size: {
      sm: '[--pagination-height:--spacing(8)]',
      md: '[--pagination-height:--spacing(10)]',
    },
  },
  defaultVariants: {
    size: 'sm',
  },
});

const Pagination = ({
  ref,
  className,
  ...props
}: React.ComponentPropsWithRef<'nav'>) => {
  return (
    <nav
      ref={ref}
      aria-label="pagination"
      className={cn('flex w-full justify-center', className)}
      {...props}
    />
  );
};

const PaginationList = ({
  ref,
  className,
  ...props
}: React.ComponentPropsWithRef<'ul'>) => {
  return (
    <ul
      ref={ref}
      className={cn('flex flex-row items-center gap-1', className)}
      {...props}
    />
  );
};

const PaginationItem = ({
  ref,
  ...props
}: React.ComponentPropsWithRef<'li'>) => {
  return <li ref={ref} {...props} />;
};

interface PaginationLinkProps extends React.ComponentPropsWithRef<'button'> {
  asChild?: boolean;
  isActive?: boolean;
  size?: 'sm' | 'md';
}

const PaginationLink = ({
  ref,
  className,
  asChild,
  isActive,
  size = 'sm',
  type = 'button',
  ...props
}: PaginationLinkProps) => {
  const Comp = asChild ? Slot : 'button';

  return (
    <Comp
      ref={ref}
      type={asChild ? undefined : type}
      aria-current={isActive ? 'page' : undefined}
      data-selected={isActive || undefined}
      className={cn(paginationLinkStyle({ size }), className)}
      {...props}
    />
  );
};

type PaginationStepProps = Omit<PaginationLinkProps, 'children'> & {
  children?: React.ReactElement;
};

const PaginationPrevious = ({
  asChild,
  children,
  ...props
}: PaginationStepProps) => {
  return (
    <PaginationLink
      asChild={asChild}
      aria-label="Go to previous page"
      {...props}
    >
      <Slottable asChild={asChild ?? false} child={children}>
        {(child) => (
          <>
            <CaretLeftIcon />
            {child}
          </>
        )}
      </Slottable>
    </PaginationLink>
  );
};

const PaginationNext = ({
  asChild,
  children,
  ...props
}: PaginationStepProps) => {
  return (
    <PaginationLink asChild={asChild} aria-label="Go to next page" {...props}>
      <Slottable asChild={asChild ?? false} child={children}>
        {(child) => (
          <>
            {child}
            <CaretRightIcon />
          </>
        )}
      </Slottable>
    </PaginationLink>
  );
};

const PaginationEllipsis = ({
  className,
  ...props
}: React.ComponentPropsWithRef<'span'>) => {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'flex h-9 w-9 items-center justify-center text-foreground-secondary',
        className
      )}
      {...props}
    >
      <DotsThreeIcon className="size-4" />
      <span className="sr-only">More pages</span>
    </span>
  );
};

const CompoundPagination = Object.assign(Pagination, {
  List: PaginationList,
  Item: PaginationItem,
  Link: PaginationLink,
  Previous: PaginationPrevious,
  Next: PaginationNext,
  Ellipsis: PaginationEllipsis,
});

export { CompoundPagination as Pagination };

interface UsePaginationOptions {
  /** Current 1-indexed page. */
  page: number;
  /** Total number of pages. */
  count: number;
  /** Pages shown on either side of the current page. */
  siblingCount?: number;
  /** Pages always shown at the start and end. */
  boundaryCount?: number;
}

export type PaginationItemDescriptor =
  | { type: 'page'; value: number; selected: boolean; key: string }
  | { type: 'ellipsis'; key: 'start-ellipsis' | 'end-ellipsis' };

const range = (start: number, end: number): number[] => {
  const length = Math.max(0, end - start + 1);
  return Array.from({ length }, (_, i) => start + i);
};

/**
 * Returns the visible page sequence for a paginator with truncation.
 */
export const usePagination = ({
  page,
  count,
  siblingCount = 1,
  boundaryCount = 1,
}: UsePaginationOptions): PaginationItemDescriptor[] => {
  return useMemo(() => {
    if (count <= 0) return [];

    const startPages = range(1, Math.min(boundaryCount, count));
    const endPages = range(
      Math.max(count - boundaryCount + 1, boundaryCount + 1),
      count
    );

    const siblingsStart = Math.max(
      Math.min(
        page - siblingCount,
        count - boundaryCount - siblingCount * 2 - 1
      ),
      boundaryCount + 2
    );
    const siblingsEnd = Math.min(
      Math.max(page + siblingCount, boundaryCount + siblingCount * 2 + 2),
      endPages.length > 0 ? endPages[0] - 2 : count - 1
    );

    const items: PaginationItemDescriptor[] = [];

    for (const value of startPages) {
      items.push({
        type: 'page',
        value,
        selected: value === page,
        key: `page-${value}`,
      });
    }

    if (siblingsStart > boundaryCount + 2) {
      items.push({ type: 'ellipsis', key: 'start-ellipsis' });
    } else if (boundaryCount + 1 < count - boundaryCount) {
      items.push({
        type: 'page',
        value: boundaryCount + 1,
        selected: page === boundaryCount + 1,
        key: `page-${boundaryCount + 1}`,
      });
    }

    for (const value of range(siblingsStart, siblingsEnd)) {
      items.push({
        type: 'page',
        value,
        selected: value === page,
        key: `page-${value}`,
      });
    }

    if (siblingsEnd < count - boundaryCount - 1) {
      items.push({ type: 'ellipsis', key: 'end-ellipsis' });
    } else if (count - boundaryCount > boundaryCount) {
      items.push({
        type: 'page',
        value: count - boundaryCount,
        selected: page === count - boundaryCount,
        key: `page-${count - boundaryCount}`,
      });
    }

    for (const value of endPages) {
      items.push({
        type: 'page',
        value,
        selected: value === page,
        key: `page-${value}`,
      });
    }

    return items;
  }, [page, count, siblingCount, boundaryCount]);
};
