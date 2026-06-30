import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";

import { Checkbox } from "@/foundations/ui/checkbox/checkbox";
import { Pagination, usePagination } from "@/foundations/ui/pagination/pagination";
import { Table } from "@/foundations/ui/table/table";

export const meta = { layout: "padded" } as const;

type Order = {
  id: string;
  customer: string;
  status: "Pending" | "Shipped" | "Delivered" | "Refunded";
  total: number;
  createdAt: string;
};

const orders: Order[] = [
  {
    id: "#1024",
    customer: "Acme Corp",
    status: "Shipped",
    total: 2480,
    createdAt: "2026-04-22",
  },
  {
    id: "#1025",
    customer: "Globex",
    status: "Pending",
    total: 415,
    createdAt: "2026-04-22",
  },
  {
    id: "#1026",
    customer: "Initech",
    status: "Delivered",
    total: 8120,
    createdAt: "2026-04-21",
  },
  {
    id: "#1027",
    customer: "Umbrella",
    status: "Refunded",
    total: 320,
    createdAt: "2026-04-20",
  },
  {
    id: "#1028",
    customer: "Soylent",
    status: "Shipped",
    total: 1675,
    createdAt: "2026-04-20",
  },
  {
    id: "#1029",
    customer: "Massive Dynamic",
    status: "Pending",
    total: 590,
    createdAt: "2026-04-19",
  },
  {
    id: "#1030",
    customer: "Tyrell",
    status: "Delivered",
    total: 4250,
    createdAt: "2026-04-18",
  },
  {
    id: "#1031",
    customer: "Wayne Ent.",
    status: "Shipped",
    total: 980,
    createdAt: "2026-04-18",
  },
  {
    id: "#1032",
    customer: "Stark Ind.",
    status: "Pending",
    total: 1340,
    createdAt: "2026-04-17",
  },
  {
    id: "#1033",
    customer: "Wonka",
    status: "Delivered",
    total: 215,
    createdAt: "2026-04-16",
  },
  {
    id: "#1034",
    customer: "Cyberdyne",
    status: "Shipped",
    total: 6700,
    createdAt: "2026-04-15",
  },
  {
    id: "#1035",
    customer: "Hooli",
    status: "Refunded",
    total: 110,
    createdAt: "2026-04-15",
  },
];

const formatAmount = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);

export default function TableDataTablePreview() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState({});

  const columns = useMemo<ColumnDef<Order>[]>(
    () => [
      {
        id: "select",
        size: 40,
        header: ({ table }) => (
          <Checkbox
            aria-label="Select all rows"
            checked={table.getIsAllPageRowsSelected()}
            indeterminate={table.getIsSomePageRowsSelected()}
            onChange={(e) => table.toggleAllPageRowsSelected(!!e.currentTarget.checked)}
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            aria-label={`Select order ${row.original.id}`}
            checked={row.getIsSelected()}
            onChange={(e) => row.toggleSelected(!!e.currentTarget.checked)}
          />
        ),
        enableSorting: false,
      },
      {
        accessorKey: "id",
        header: "Order",
        cell: (info) => <span className="font-medium">{info.getValue<string>()}</span>,
      },
      { accessorKey: "customer", header: "Customer" },
      { accessorKey: "status", header: "Status" },
      {
        accessorKey: "createdAt",
        header: "Created",
      },
      {
        accessorKey: "total",
        header: "Total",
        cell: (info) => formatAmount(info.getValue<number>()),
        meta: { align: "end" as const },
      },
    ],
    [],
  );

  const table = useReactTable({
    data: orders,
    columns,
    state: { sorting, rowSelection },
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 5 } },
  });

  const pageCount = table.getPageCount();
  const pageIndex = table.getState().pagination.pageIndex;
  const items = usePagination({ page: pageIndex + 1, count: pageCount });

  const selectedCount = table.getSelectedRowModel().rows.length;

  return (
    <div className="flex flex-col gap-4">
      <Table.Container>
        <Table>
          <Table.Header>
            {table.getHeaderGroups().map((headerGroup) => (
              <Table.Row key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const align = (
                    header.column.columnDef.meta as
                      | { align?: "start" | "center" | "end" }
                      | undefined
                  )?.align;
                  const canSort = header.column.getCanSort();
                  const sort = header.column.getIsSorted();

                  if (canSort) {
                    return (
                      <Table.SortableHead
                        key={header.id}
                        align={align}
                        sort={sort === false ? false : sort}
                        onSort={header.column.getToggleSortingHandler() ?? (() => {})}
                        style={header.getSize() !== 150 ? { width: header.getSize() } : undefined}
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                      </Table.SortableHead>
                    );
                  }

                  return (
                    <Table.Head
                      key={header.id}
                      align={align}
                      style={header.getSize() !== 150 ? { width: header.getSize() } : undefined}
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </Table.Head>
                  );
                })}
              </Table.Row>
            ))}
          </Table.Header>
          <Table.Body>
            {table.getRowModel().rows.length === 0 ? (
              <Table.Row>
                <Table.Cell
                  colSpan={columns.length}
                  align="center"
                  className="h-24 text-foreground-secondary"
                >
                  No results.
                </Table.Cell>
              </Table.Row>
            ) : (
              table.getRowModel().rows.map((row) => (
                <Table.Row key={row.id} data-selected={row.getIsSelected() || undefined}>
                  {row.getVisibleCells().map((cell) => {
                    const align = (
                      cell.column.columnDef.meta as
                        | { align?: "start" | "center" | "end" }
                        | undefined
                    )?.align;
                    return (
                      <Table.Cell key={cell.id} align={align}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </Table.Cell>
                    );
                  })}
                </Table.Row>
              ))
            )}
          </Table.Body>
        </Table>
      </Table.Container>

      <div className="flex items-center justify-between gap-4">
        <p className="text-foreground-secondary text-sm">
          {selectedCount} of {table.getFilteredRowModel().rows.length} selected
        </p>

        <Pagination className="w-auto">
          <Pagination.List>
            <Pagination.Item>
              <Pagination.Previous
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              />
            </Pagination.Item>

            {items.map((item) =>
              item.type === "page" ? (
                <Pagination.Item key={item.key}>
                  <Pagination.Link
                    isActive={item.selected}
                    onClick={() => table.setPageIndex(item.value - 1)}
                  >
                    {item.value}
                  </Pagination.Link>
                </Pagination.Item>
              ) : (
                <Pagination.Item key={item.key}>
                  <Pagination.Ellipsis />
                </Pagination.Item>
              ),
            )}

            <Pagination.Item>
              <Pagination.Next
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              />
            </Pagination.Item>
          </Pagination.List>
        </Pagination>
      </div>
    </div>
  );
}
