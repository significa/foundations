"use client";

import { useState } from "react";

import { Button } from "@/foundations/ui/button/button";
import { Checkbox } from "@/foundations/ui/checkbox/checkbox";
import {
  Dropdown,
  DropdownItem,
  DropdownItems,
  DropdownTrigger,
} from "@/foundations/ui/dropdown/dropdown";

const people = [
  { id: 1, name: "Durward Reynolds" },
  { id: 2, name: "Kenton Towne" },
  { id: 3, name: "Therese Wunsch" },
  { id: 4, name: "Benedict Kessler" },
  { id: 5, name: "Katelyn Rohan" },
];

export default function DropdownMultiplePreview() {
  const [selected, setSelected] = useState<number[]>([]);

  return (
    <Dropdown>
      <DropdownTrigger asChild>
        <Button variant="outline">Select People</Button>
      </DropdownTrigger>
      <DropdownItems>
        {people.map((person) => (
          <DropdownItem
            key={person.id}
            className="px-2"
            onSelect={(e) => {
              e.preventDefault(); // prevent close
              setSelected((prev) =>
                prev.includes(person.id)
                  ? prev.filter((id) => id !== person.id)
                  : [...prev, person.id]
              );
            }}
          >
            <Checkbox
              className="pointer-events-none"
              checked={selected.includes(person.id)}
              readOnly
            />
            <span>{person.name}</span>
          </DropdownItem>
        ))}
      </DropdownItems>
    </Dropdown>
  );
}
