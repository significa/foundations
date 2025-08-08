"use client";

import { useState } from "react";

import {
  Listbox,
  ListboxOption,
  ListboxOptions,
  ListboxTrigger,
} from "@/foundations/ui/listbox/listbox";

const people = [
  { id: 1, name: "Durward Reynolds" },
  { id: 2, name: "Kenton Towne" },
  { id: 3, name: "Therese Wunsch" },
  { id: 4, name: "Benedict Kessler" },
  { id: 5, name: "Katelyn Rohan" },
];

export default function ListboxMinimalPreview() {
  const [selectedPerson, setSelectedPerson] = useState(people[0]);

  return (
    <div className="w-80">
      <Listbox value={selectedPerson} onChange={setSelectedPerson}>
        <ListboxTrigger variant="minimal">
          {selectedPerson?.name}
        </ListboxTrigger>
        <ListboxOptions>
          {people.map((person) => (
            <ListboxOption key={person.id} value={person}>
              {person.name}
            </ListboxOption>
          ))}
        </ListboxOptions>
      </Listbox>
    </div>
  );
}
