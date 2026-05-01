import { useMemo, useState } from 'react';

import { Table } from '@/foundations/ui/table/table';

export const meta = { layout: 'padded' } as const;

type SortKey = 'name' | 'role' | 'joined';
type SortDir = 'asc' | 'desc';

const team = [
  { name: 'Ana Costa', role: 'Designer', joined: '2024-02-12' },
  { name: 'Bruno Silva', role: 'Engineer', joined: '2023-08-30' },
  { name: 'Carla Mendes', role: 'PM', joined: '2025-01-04' },
  { name: 'Diogo Pinto', role: 'Engineer', joined: '2022-11-19' },
  { name: 'Elisa Faria', role: 'Designer', joined: '2024-09-22' },
];

export default function TableSortablePreview() {
  const [sortKey, setSortKey] = useState<SortKey>('name');
  const [sortDir, setSortDir] = useState<SortDir>('asc');

  const sorted = useMemo(() => {
    return [...team].sort((a, b) => {
      const cmp = a[sortKey].localeCompare(b[sortKey]);
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }, [sortKey, sortDir]);

  const sortFor = (key: SortKey) =>
    sortKey === key ? sortDir : (false as const);

  const handleSort = (key: SortKey) => () => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  return (
    <Table>
      <Table.Header>
        <Table.Row>
          <Table.SortableHead
            sort={sortFor('name')}
            onSort={handleSort('name')}
          >
            Name
          </Table.SortableHead>
          <Table.SortableHead
            sort={sortFor('role')}
            onSort={handleSort('role')}
          >
            Role
          </Table.SortableHead>
          <Table.SortableHead
            sort={sortFor('joined')}
            onSort={handleSort('joined')}
          >
            Joined
          </Table.SortableHead>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {sorted.map((member) => (
          <Table.Row key={member.name}>
            <Table.Cell className="font-medium">{member.name}</Table.Cell>
            <Table.Cell>{member.role}</Table.Cell>
            <Table.Cell>{member.joined}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
}
