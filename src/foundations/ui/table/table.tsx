import { CaretDownIcon, CaretUpDownIcon, CaretUpIcon } from "@phosphor-icons/react/dist/ssr";

import { cn, cva } from "@/lib/utils/classnames";

const tableStyle = cva({
  base: [
    "w-full caption-bottom border-collapse text-sm",
    "[--table-cell-px:--spacing(4)] [--table-cell-py:--spacing(3)]",
  ],
  variants: {
    density: {
      sm: "[--table-cell-py:--spacing(2)]",
      md: "[--table-cell-py:--spacing(3)]",
    },
  },
  defaultVariants: {
    density: "md",
  },
});

interface TableContainerProps extends React.ComponentPropsWithRef<"div"> {
  bordered?: boolean;
}

const TableContainer = ({ ref, className, bordered = true, ...props }: TableContainerProps) => {
  return (
    <div
      ref={ref}
      className={cn(
        "relative w-full overflow-x-auto",
        bordered && "rounded-lg border border-border shadow-xs",
        className,
      )}
      {...props}
    />
  );
};

interface TableProps extends React.ComponentPropsWithRef<"table"> {
  density?: "sm" | "md";
}

const Table = ({ ref, className, density, ...props }: TableProps) => {
  return <table ref={ref} className={cn(tableStyle({ density }), className)} {...props} />;
};

interface TableHeaderProps extends React.ComponentPropsWithRef<"thead"> {
  sticky?: boolean;
}

const TableHeader = ({ ref, className, sticky, ...props }: TableHeaderProps) => {
  return (
    <thead
      ref={ref}
      className={cn(
        "[&_tr]:border-border [&_tr]:border-b",
        sticky && "sticky top-0 z-10 bg-background",
        className,
      )}
      {...props}
    />
  );
};

const TableBody = ({ ref, className, ...props }: React.ComponentPropsWithRef<"tbody">) => {
  return (
    <tbody
      ref={ref}
      className={cn("[&_tr:last-child]:border-0 [&_tr]:border-border [&_tr]:border-b", className)}
      {...props}
    />
  );
};

const TableFooter = ({ ref, className, ...props }: React.ComponentPropsWithRef<"tfoot">) => {
  return (
    <tfoot
      ref={ref}
      className={cn("border-border border-t bg-foreground/2 font-medium", className)}
      {...props}
    />
  );
};

const TableRow = ({ ref, className, ...props }: React.ComponentPropsWithRef<"tr">) => {
  return (
    <tr
      ref={ref}
      className={cn("transition-colors", "data-selected:bg-accent/4", className)}
      {...props}
    />
  );
};

const cellAlignStyle = cva({
  variants: {
    align: {
      start: "text-start",
      center: "text-center",
      end: "text-end",
    },
  },
  defaultVariants: {
    align: "start",
  },
});

interface TableHeadProps extends Omit<React.ComponentPropsWithRef<"th">, "align"> {
  align?: "start" | "center" | "end";
}

const TableHead = ({ ref, className, align, ...props }: TableHeadProps) => {
  return (
    <th
      ref={ref}
      className={cn(
        "h-10 px-(--table-cell-px) align-middle font-medium text-foreground-secondary",
        "whitespace-nowrap",
        cellAlignStyle({ align }),
        className,
      )}
      {...props}
    />
  );
};

interface TableCellProps extends Omit<React.ComponentPropsWithRef<"td">, "align"> {
  align?: "start" | "center" | "end";
}

const TableCell = ({ ref, className, align, ...props }: TableCellProps) => {
  return (
    <td
      ref={ref}
      className={cn(
        "px-(--table-cell-px) py-(--table-cell-py) align-middle",
        cellAlignStyle({ align }),
        className,
      )}
      {...props}
    />
  );
};

const TableCaption = ({ ref, className, ...props }: React.ComponentPropsWithRef<"caption">) => {
  return (
    <caption
      ref={ref}
      className={cn("mt-4 text-foreground-secondary text-sm", className)}
      {...props}
    />
  );
};

interface TableSortableHeadProps extends Omit<TableHeadProps, "onClick"> {
  sort: "asc" | "desc" | false;
  onSort: (event?: React.MouseEvent<HTMLButtonElement>) => void;
}

const TableSortableHead = ({
  className,
  children,
  sort,
  onSort,
  ...props
}: TableSortableHeadProps) => {
  const ariaSort = sort === "asc" ? "ascending" : sort === "desc" ? "descending" : "none";

  const Icon = sort === "asc" ? CaretUpIcon : sort === "desc" ? CaretDownIcon : CaretUpDownIcon;

  return (
    <TableHead
      aria-sort={ariaSort}
      data-sort={sort || undefined}
      className={cn("p-0", className)}
      {...props}
    >
      <button
        type="button"
        onClick={onSort}
        className={cn(
          "group/sort flex h-10 w-full items-center gap-1.5 px-(--table-cell-px) py-0",
          "cursor-pointer text-start font-medium text-foreground-secondary",
          "transition-colors hover:text-foreground",
          "focus-visible:ring-(length:--ring-width) outline-none ring-ring",
          "data-[align=end]:justify-end data-[align=center]:justify-center",
        )}
        data-align={props.align}
      >
        {children}
        <Icon
          aria-hidden="true"
          className={cn(
            "size-3.5 shrink-0 transition-opacity",
            sort ? "opacity-100" : "opacity-40 group-hover/sort:opacity-70",
          )}
        />
      </button>
    </TableHead>
  );
};

const CompoundTable = Object.assign(Table, {
  Container: TableContainer,
  Header: TableHeader,
  Body: TableBody,
  Footer: TableFooter,
  Row: TableRow,
  Head: TableHead,
  Cell: TableCell,
  Caption: TableCaption,
  SortableHead: TableSortableHead,
});

export { CompoundTable as Table };
