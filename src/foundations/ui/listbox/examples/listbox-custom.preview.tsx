'use client';

import { useState } from 'react';

import { Avatar } from '@/foundations/ui/avatar/avatar';
import { Listbox } from '@/foundations/ui/listbox/listbox';

const people = [
  { id: 1, name: 'Durward Reynolds' },
  { id: 2, name: 'Kenton Towne' },
  { id: 3, name: 'Therese Wunsch' },
  { id: 4, name: 'Benedict Kessler' },
  { id: 5, name: 'Katelyn Rohan' },
];

export default function ListboxCustomPreview() {
  const [selectedPerson, setSelectedPerson] = useState<
    (typeof people)[number] | null
  >(null);

  return (
    <div className="w-80">
      <Listbox value={selectedPerson} onChange={setSelectedPerson}>
        <Listbox.Trigger
          placeholder="Select person"
          className={selectedPerson ? 'pl-3' : ''}
        >
          {selectedPerson && (
            <span className="flex items-center gap-2">
              <Avatar size="xs">
                <Avatar.Image
                  src={`https://api.dicebear.com/6.x/thumbs/svg?seed=${selectedPerson.name}`}
                />
                <Avatar.Fallback>{selectedPerson.name[0]}</Avatar.Fallback>
              </Avatar>
              <span>{selectedPerson.name}</span>
            </span>
          )}
        </Listbox.Trigger>
        <Listbox.Options>
          {people.map((person) => (
            <Listbox.Option
              key={person.id}
              value={person}
              className="flex items-center gap-2 px-3"
            >
              <Avatar size="xs">
                <Avatar.Image
                  src={`https://api.dicebear.com/6.x/thumbs/svg?seed=${person.name}`}
                />
                <Avatar.Fallback>{person.name[0]}</Avatar.Fallback>
              </Avatar>
              <span>{person.name}</span>
            </Listbox.Option>
          ))}
        </Listbox.Options>
      </Listbox>
    </div>
  );
}
