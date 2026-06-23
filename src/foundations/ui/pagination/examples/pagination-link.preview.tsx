import { Pagination, usePagination } from "@/foundations/ui/pagination/pagination";

export default function PaginationLinkPreview() {
  // In a real app, derive `page` from the URL (search params or route).
  const page = 3;
  const count = 8;
  const items = usePagination({ page, count });

  const hrefFor = (p: number) => `?page=${p}`;

  return (
    <Pagination>
      <Pagination.List>
        <Pagination.Item>
          <Pagination.Previous asChild>
            <a href={hrefFor(Math.max(1, page - 1))}>
              <span className="sr-only">Previous</span>
            </a>
          </Pagination.Previous>
        </Pagination.Item>

        {items.map((item) =>
          item.type === "page" ? (
            <Pagination.Item key={item.key}>
              <Pagination.Link asChild isActive={item.selected}>
                <a href={hrefFor(item.value)}>{item.value}</a>
              </Pagination.Link>
            </Pagination.Item>
          ) : (
            <Pagination.Item key={item.key}>
              <Pagination.Ellipsis />
            </Pagination.Item>
          ),
        )}

        <Pagination.Item>
          <Pagination.Next asChild>
            <a href={hrefFor(Math.min(count, page + 1))}>
              <span className="sr-only">Next</span>
            </a>
          </Pagination.Next>
        </Pagination.Item>
      </Pagination.List>
    </Pagination>
  );
}
