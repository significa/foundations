import { useState } from "react";

import { Pagination } from "@/foundations/ui/pagination/pagination";

export default function PaginationSimplePreview() {
  const [page, setPage] = useState(1);
  const count = 5;

  return (
    <Pagination>
      <Pagination.List>
        <Pagination.Item>
          <Pagination.Previous
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          />
        </Pagination.Item>

        {Array.from({ length: count }, (_, i) => i + 1).map((value) => (
          <Pagination.Item key={value}>
            <Pagination.Link isActive={value === page} onClick={() => setPage(value)}>
              {value}
            </Pagination.Link>
          </Pagination.Item>
        ))}

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
