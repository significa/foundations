"use client";

import { useMemo, useState } from "react";

import {
  Listbox,
  ListboxEmpty,
  ListboxOption,
  ListboxOptions,
  ListboxSearchInput,
  ListboxTrigger,
} from "@/foundations/ui/listbox/listbox";

const people = [
  { id: 1, name: "Durward Reynolds" },
  { id: 2, name: "Kenton Towne" },
  { id: 3, name: "Therese Wunsch" },
  { id: 4, name: "Benedict Kessler" },
  { id: 5, name: "Katelyn Rohan" },
];

export default function ListboxSearchPreview() {
  const [search, setSearch] = useState("");
  const [selectedPerson, setSelectedPerson] = useState(people[0]);

  const filteredPeople = useMemo(() => {
    return people.filter((person) =>
      person.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  return (
    <div className="w-80">
      <Listbox value={selectedPerson} onChange={setSelectedPerson}>
        <ListboxTrigger>{selectedPerson?.name}</ListboxTrigger>
        <ListboxOptions>
          <ListboxSearchInput
            placeholder="Search people"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {filteredPeople.map((person) => (
            <ListboxOption key={person.id} value={person}>
              {person.name}
            </ListboxOption>
          ))}
          {filteredPeople.length === 0 && (
            <ListboxEmpty>No results</ListboxEmpty>
          )}
        </ListboxOptions>
      </Listbox>
    </div>
  );
}
