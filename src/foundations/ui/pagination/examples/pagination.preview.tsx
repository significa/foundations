import { useState } from 'react';

import {
  Pagination,
  usePagination,
} from '@/foundations/ui/pagination/pagination';

export default function PaginationPreview() {
  const [page, setPage] = useState(1);
  const count = 10;
  const items = usePagination({ page, count });

  return (
    <Pagination>
      <Pagination.List>
        <Pagination.Item>
          <Pagination.Previous
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          />
        </Pagination.Item>

        {items.map((item) =>
          item.type === 'page' ? (
            <Pagination.Item key={item.key}>
              <Pagination.Link
                isActive={item.selected}
                onClick={() => setPage(item.value)}
              >
                {item.value}
              </Pagination.Link>
            </Pagination.Item>
          ) : (
            <Pagination.Item key={item.key}>
              <Pagination.Ellipsis />
            </Pagination.Item>
          )
        )}

        <Pagination.Item>
          <Pagination.Next
            onClick={() => setPage((p) => Math.min(count, p + 1))}
            disabled={page === count}
          />
        </Pagination.Item>
      </Pagination.List>
    </Pagination>
  );
}
