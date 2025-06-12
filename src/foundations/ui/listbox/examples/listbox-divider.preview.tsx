"use client";

import {
  Listbox,
  ListboxDivider,
  ListboxOption,
  ListboxOptions,
  ListboxTrigger,
} from "@/foundations/ui/listbox/listbox";
import { Fragment, useState } from "react";

const people = [
  { id: 1, name: "Durward Reynolds" },
  { id: 2, name: "Kenton Towne" },
  { id: 3, name: "Therese Wunsch" },
  { id: 4, name: "Benedict Kessler" },
  { id: 5, name: "Katelyn Rohan" },
];

export default function ListboxDividerPreview() {
  const [selectedPerson, setSelectedPerson] = useState(people[0]);

  return (
    <div className="w-80">
      <Listbox value={selectedPerson} onChange={setSelectedPerson}>
        <ListboxTrigger>{selectedPerson?.name}</ListboxTrigger>
        <ListboxOptions>
          {people.map((person, i) => (
            <Fragment key={person.id}>
              <ListboxOption value={person}>{person.name}</ListboxOption>
              {i === 2 && <ListboxDivider />}
            </Fragment>
          ))}
        </ListboxOptions>
      </Listbox>
    </div>
  );
}
