import { MagnifyingGlassIcon } from "@phosphor-icons/react/dist/ssr";
import { useMemo, useState } from "react";

import { Input } from "#/foundations/ui/input/input.tsx";
import { Listbox } from "#/foundations/ui/listbox/listbox.tsx";

const people = [
  { id: 1, name: "Durward Reynolds" },
  { id: 2, name: "Kenton Towne" },
  { id: 3, name: "Therese Wunsch" },
  { id: 4, name: "Benedict Kessler" },
  { id: 5, name: "Katelyn Rohan" },
];

export default function ListboxMultiplePreview() {
  const [selectedPeople, setSelectedPeople] = useState<(typeof people)[number][]>([]);
  const [search, setSearch] = useState("");

  const filteredPeople = useMemo(() => {
    return people.filter((person) => person.name.toLowerCase().includes(search.toLowerCase()));
  }, [search]);

  return (
    <div className="w-80">
      <Listbox value={selectedPeople} onChange={setSelectedPeople}>
        <Listbox.Trigger placeholder="Select people">
          {selectedPeople.length > 1
            ? `${selectedPeople.length} people selected`
            : selectedPeople[0]?.name}
        </Listbox.Trigger>
        <Listbox.Options>
          <Input.Group className="rounded-none border-x-0 border-t-0 shadow-none hover:border-border [:focus-visible,:has(:focus-visible)]:border-border [:focus-visible,:has(:focus-visible)]:ring-0">
            <Input.Addon>
              <MagnifyingGlassIcon weight="bold" />
            </Input.Addon>
            <Listbox.SearchInput
              placeholder="Search people"
              aria-label="Search people"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </Input.Group>
          {filteredPeople.map((person) => (
            <Listbox.Option key={person.id} value={person}>
              {person.name}
            </Listbox.Option>
          ))}
          {filteredPeople.length === 0 && <Listbox.Empty>No results</Listbox.Empty>}
        </Listbox.Options>
      </Listbox>
    </div>
  );
}
