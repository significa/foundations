import { useState } from "react";

import { Checkbox } from "@/foundations/ui/checkbox/checkbox";
import { Table } from "@/foundations/ui/table/table";

export const meta = { layout: "padded" } as const;

const tasks = [
  { id: "t-1", title: "Review PR #482", priority: "High", assignee: "Ana" },
  {
    id: "t-2",
    title: "Update onboarding copy",
    priority: "Low",
    assignee: "Bruno",
  },
  {
    id: "t-3",
    title: "Fix flaky checkout test",
    priority: "High",
    assignee: "Carla",
  },
  {
    id: "t-4",
    title: "Audit color tokens",
    priority: "Medium",
    assignee: "Diogo",
  },
];

export default function TableWithSelectionPreview() {
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const allSelected = selected.size === tasks.length;
  const someSelected = selected.size > 0 && !allSelected;

  const toggleAll = () => {
    setSelected(allSelected ? new Set() : new Set(tasks.map((t) => t.id)));
  };

  const toggleOne = (id: string) => () => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <Table>
      <Table.Header>
        <Table.Row>
          <Table.Head className="w-10">
            <Checkbox
              checked={allSelected}
              indeterminate={someSelected}
              onChange={toggleAll}
              aria-label="Select all rows"
            />
          </Table.Head>
          <Table.Head>Task</Table.Head>
          <Table.Head>Priority</Table.Head>
          <Table.Head>Assignee</Table.Head>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {tasks.map((task) => {
          const isSelected = selected.has(task.id);
          return (
            <Table.Row key={task.id} data-selected={isSelected || undefined}>
              <Table.Cell>
                <Checkbox
                  checked={isSelected}
                  onChange={toggleOne(task.id)}
                  aria-label={`Select ${task.title}`}
                />
              </Table.Cell>
              <Table.Cell className="font-medium">{task.title}</Table.Cell>
              <Table.Cell>{task.priority}</Table.Cell>
              <Table.Cell>{task.assignee}</Table.Cell>
            </Table.Row>
          );
        })}
      </Table.Body>
    </Table>
  );
}
