import { Fragment, useState } from 'react';

import { Listbox } from '@/foundations/ui/listbox/listbox';

const people = [
  { id: 1, name: 'Durward Reynolds' },
  { id: 2, name: 'Kenton Towne' },
  { id: 3, name: 'Therese Wunsch' },
  { id: 4, name: 'Benedict Kessler' },
  { id: 5, name: 'Katelyn Rohan' },
];

export default function ListboxDividerPreview() {
  const [selectedPerson, setSelectedPerson] = useState(people[0]);

  return (
    <div className="w-80">
      <Listbox value={selectedPerson} onChange={setSelectedPerson}>
        <Listbox.Trigger>{selectedPerson?.name}</Listbox.Trigger>
        <Listbox.Options>
          {people.map((person, i) => (
            <Fragment key={person.id}>
              <Listbox.Option value={person}>{person.name}</Listbox.Option>
              {i === 2 && <Listbox.Divider />}
            </Fragment>
          ))}
        </Listbox.Options>
      </Listbox>
    </div>
  );
}
