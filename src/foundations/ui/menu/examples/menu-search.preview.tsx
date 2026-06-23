import { useMemo, useState } from "react";
import { Button } from "@/foundations/ui/button/button";
import { Menu } from "@/foundations/ui/menu/menu";

const FRUITS = [
  "Apple",
  "Banana",
  "Blueberry",
  "Cherry",
  "Grape",
  "Mango",
  "Orange",
  "Peach",
  "Pineapple",
  "Strawberry",
  "Watermelon",
];

export default function MenuSearchPreview() {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return FRUITS;
    return FRUITS.filter((f) => f.toLowerCase().includes(q));
  }, [query]);

  return (
    <Menu>
      <Menu.Trigger asChild>
        <Button variant="outline">Pick a fruit</Button>
      </Menu.Trigger>
      <Menu.Items>
        <Menu.SearchInput
          placeholder="Search fruits..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {filtered.map((fruit) => (
          <Menu.Item key={fruit}>{fruit}</Menu.Item>
        ))}
        {filtered.length === 0 && <Menu.Empty>No fruits found</Menu.Empty>}
      </Menu.Items>
    </Menu>
  );
}
