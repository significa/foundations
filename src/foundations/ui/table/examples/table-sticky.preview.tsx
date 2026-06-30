import { Table } from "@/foundations/ui/table/table";

export const meta = { layout: "padded" } as const;

const commits = Array.from({ length: 30 }, (_, i) => ({
  hash: (0x4a2f1c + i * 0x1d3).toString(16).slice(0, 7),
  author: ["Ana Costa", "Bruno Silva", "Carla Mendes", "Diogo Pinto"][i % 4],
  message: [
    "Fix sticky header scroll context",
    "Add Table.Container part",
    "Bump dependencies",
    "Tidy up docs",
  ][i % 4],
}));

export default function TableStickyPreview() {
  return (
    <Table.Container className="max-h-72">
      <Table>
        <Table.Header sticky>
          <Table.Row>
            <Table.Head>Commit</Table.Head>
            <Table.Head>Author</Table.Head>
            <Table.Head>Message</Table.Head>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {commits.map((commit) => (
            <Table.Row key={commit.hash}>
              <Table.Cell className="font-mono">{commit.hash}</Table.Cell>
              <Table.Cell>{commit.author}</Table.Cell>
              <Table.Cell>{commit.message}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </Table.Container>
  );
}
