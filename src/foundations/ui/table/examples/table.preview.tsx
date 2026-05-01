import { Table } from '@/foundations/ui/table/table';

export const meta = { layout: 'padded' } as const;

const invoices = [
  { id: 'INV-001', client: 'Acme Corp', status: 'Paid', amount: 1250 },
  { id: 'INV-002', client: 'Globex', status: 'Pending', amount: 480 },
  { id: 'INV-003', client: 'Initech', status: 'Paid', amount: 3200 },
  { id: 'INV-004', client: 'Umbrella', status: 'Overdue', amount: 920 },
  { id: 'INV-005', client: 'Soylent', status: 'Pending', amount: 1675 },
];

const formatAmount = (value: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value);

export default function TablePreview() {
  const total = invoices.reduce((sum, i) => sum + i.amount, 0);

  return (
    <Table>
      <Table.Caption>Recent invoices</Table.Caption>
      <Table.Header>
        <Table.Row>
          <Table.Head>Invoice</Table.Head>
          <Table.Head>Client</Table.Head>
          <Table.Head>Status</Table.Head>
          <Table.Head align="end">Amount</Table.Head>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {invoices.map((invoice) => (
          <Table.Row key={invoice.id}>
            <Table.Cell className="font-medium">{invoice.id}</Table.Cell>
            <Table.Cell>{invoice.client}</Table.Cell>
            <Table.Cell>{invoice.status}</Table.Cell>
            <Table.Cell align="end">{formatAmount(invoice.amount)}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
      <Table.Footer>
        <Table.Row>
          <Table.Cell colSpan={3}>Total</Table.Cell>
          <Table.Cell align="end">{formatAmount(total)}</Table.Cell>
        </Table.Row>
      </Table.Footer>
    </Table>
  );
}
