import { MagnifyingGlassIcon } from "@phosphor-icons/react/dist/ssr";
import { useEffect, useState } from "react";

import { Input } from "#/foundations/ui/input/input.tsx";
import { Listbox } from "#/foundations/ui/listbox/listbox.tsx";
import { Spinner } from "#/foundations/ui/spinner/spinner.tsx";

const FRUITS = [
  "Apple",
  "Apricot",
  "Avocado",
  "Banana",
  "Blackberry",
  "Blueberry",
  "Cherry",
  "Coconut",
  "Date",
  "Dragon Fruit",
  "Elderberry",
  "Fig",
  "Grape",
  "Grapefruit",
  "Guava",
  "Honeydew",
  "Kiwi",
  "Lemon",
  "Lime",
  "Mango",
  "Nectarine",
  "Orange",
  "Papaya",
  "Passion Fruit",
  "Peach",
  "Pear",
  "Persimmon",
  "Pineapple",
  "Plum",
  "Pomegranate",
  "Quince",
  "Raspberry",
  "Strawberry",
  "Tangerine",
  "Watermelon",
];

const fakeSearch = (query: string): Promise<string[]> =>
  new Promise((resolve) => {
    window.setTimeout(() => {
      const q = query.toLowerCase();
      resolve(FRUITS.filter((f) => f.toLowerCase().includes(q)));
    }, 400);
  });

export default function ListboxAsyncPreview() {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<string[]>(FRUITS);
  const [isLoading, setIsLoading] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    const handle = window.setTimeout(async () => {
      const data = await fakeSearch(search);
      setResults(data);
      setIsLoading(false);
    }, 200);
    return () => window.clearTimeout(handle);
  }, [search]);

  return (
    <div className="w-80">
      <Listbox value={selected} onChange={setSelected}>
        <Listbox.Trigger placeholder="Pick a fruit">{selected}</Listbox.Trigger>
        <Listbox.Options>
          <Input.Group className="rounded-none border-x-0 border-t-0 shadow-none hover:border-border [:focus-visible,:has(:focus-visible)]:border-border [:focus-visible,:has(:focus-visible)]:ring-0">
            <Input.Addon>
              {isLoading ? <Spinner size="sm" /> : <MagnifyingGlassIcon weight="bold" />}
            </Input.Addon>
            <Listbox.SearchInput
              placeholder="Search fruits"
              aria-label="Search fruits"
              aria-busy={isLoading || undefined}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </Input.Group>
          {results.map((fruit) => (
            <Listbox.Option key={fruit} value={fruit}>
              {fruit}
            </Listbox.Option>
          ))}
          {!isLoading && results.length === 0 && <Listbox.Empty>No results</Listbox.Empty>}
        </Listbox.Options>
      </Listbox>
    </div>
  );
}
