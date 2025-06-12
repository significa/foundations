"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/foundations/ui/avatar/avatar";
import {
  Listbox,
  ListboxOption,
  ListboxOptions,
  ListboxTrigger,
} from "@/foundations/ui/listbox/listbox";
import { useState } from "react";

const people = [
  { id: 1, name: "Durward Reynolds" },
  { id: 2, name: "Kenton Towne" },
  { id: 3, name: "Therese Wunsch" },
  { id: 4, name: "Benedict Kessler" },
  { id: 5, name: "Katelyn Rohan" },
];

export default function ListboxCustomPreview() {
  const [selectedPerson, setSelectedPerson] = useState<
    (typeof people)[number] | null
  >(null);

  return (
    <div className="w-80">
      <Listbox value={selectedPerson} onChange={setSelectedPerson}>
        <ListboxTrigger
          placeholder="Select person"
          className={selectedPerson ? "pl-3" : ""}
        >
          {selectedPerson && (
            <span className="flex items-center gap-2">
              <Avatar size="xs">
                <AvatarImage
                  src={`https://api.dicebear.com/6.x/thumbs/svg?seed=${selectedPerson.name}`}
                />
                <AvatarFallback>{selectedPerson.name[0]}</AvatarFallback>
              </Avatar>
              <span>{selectedPerson.name}</span>
            </span>
          )}
        </ListboxTrigger>
        <ListboxOptions>
          {people.map((person) => (
            <ListboxOption
              key={person.id}
              value={person}
              className="flex items-center gap-2 px-3"
            >
              <Avatar size="xs">
                <AvatarImage
                  src={`https://api.dicebear.com/6.x/thumbs/svg?seed=${person.name}`}
                />
                <AvatarFallback>{person.name[0]}</AvatarFallback>
              </Avatar>
              <span>{person.name}</span>
            </ListboxOption>
          ))}
        </ListboxOptions>
      </Listbox>
    </div>
  );
}
