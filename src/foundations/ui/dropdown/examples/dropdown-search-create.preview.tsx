import { UserCircleIcon } from '@phosphor-icons/react/dist/ssr';
import { useMemo, useState } from 'react';

import { Avatar } from '@/foundations/ui/avatar/avatar';
import { Button } from '@/foundations/ui/button/button';
import { Checkbox } from '@/foundations/ui/checkbox/checkbox';
import { Dropdown } from '@/foundations/ui/dropdown/dropdown';

type Person = { id: number; name: string };

const initialPeople: Person[] = [
  { id: 1, name: 'Durward Reynolds' },
  { id: 2, name: 'Kenton Towne' },
  { id: 3, name: 'Therese Wunsch' },
  { id: 4, name: 'Benedict Kessler' },
  { id: 5, name: 'Katelyn Rohan' },
  { id: 6, name: 'Demetrius Ward' },
  { id: 7, name: 'Eleanora Fisher' },
  { id: 8, name: 'Augustus Palmer' },
  { id: 9, name: 'Cordelia Blake' },
  { id: 10, name: 'Sebastian Hayes' },
];

export default function DropdownSearchCreatePreview() {
  const [people, setPeople] = useState<Person[]>(initialPeople);
  const [selected, setSelected] = useState<Person[]>([]);
  const [search, setSearch] = useState('');

  const filteredPeople = useMemo(() => {
    return people.filter((person) =>
      person.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, people]);

  const onOpenChange = (open: boolean) => {
    if (!open) {
      setTimeout(() => {
        setSearch('');
        setPeople((prev) => [
          ...selected,
          ...prev.filter((person) => !selected.some((s) => s.id === person.id)),
        ]);
      }, 200); // wait for menu to close
    }
  };

  return (
    <div className="w-96 rounded-3xl border border-border p-4">
      <Dropdown onOpenChange={onOpenChange}>
        <Dropdown.Trigger asChild>
          <Button variant="outline">Select People</Button>
        </Dropdown.Trigger>
        <Dropdown.Items>
          <Dropdown.SearchInput
            placeholder="Search people"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {filteredPeople.map((person) => (
            <Dropdown.Item
              key={person.id}
              className="px-2"
              onSelect={(e) => {
                e.preventDefault(); // prevent close
                setSelected((prev) =>
                  prev.some((p) => p.id === person.id)
                    ? prev.filter((p) => p.id !== person.id)
                    : [...prev, person]
                );
              }}
            >
              <Checkbox
                className="pointer-events-none"
                checked={selected.some((p) => p.id === person.id)}
                readOnly
              />
              <span>{person.name}</span>
            </Dropdown.Item>
          ))}
          {filteredPeople.length === 0 && (
            <Dropdown.Empty>No results</Dropdown.Empty>
          )}
          {search && (
            <>
              <Dropdown.Divider />
              <Dropdown.Item
                onSelect={() => {
                  const newPerson = {
                    id: people.length + 1,
                    name: search,
                  };
                  setPeople((prev) => [...prev, newPerson]);
                  setSelected((prev) => [...prev, newPerson]);
                  setSearch('');
                }}
              >
                Create &quot;{search}&quot;
              </Dropdown.Item>
            </>
          )}
        </Dropdown.Items>
      </Dropdown>
      {selected.length > 0 ? (
        <div className="mt-4 flex flex-wrap items-center gap-y-2 -space-x-2">
          {selected.map((person) => (
            <Avatar key={person.id} size="sm">
              <Avatar.Fallback>{person.name[0]}</Avatar.Fallback>
            </Avatar>
          ))}
        </div>
      ) : (
        <div className="mt-4 flex h-8 items-center gap-1 text-foreground-secondary text-sm">
          <UserCircleIcon className="text-base" /> No people selected
        </div>
      )}
    </div>
  );
}
