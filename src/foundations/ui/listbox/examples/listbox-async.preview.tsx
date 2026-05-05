import { useEffect, useState } from 'react';

import { Listbox } from '@/foundations/ui/listbox/listbox';

const FRUITS = [
  'Apple',
  'Apricot',
  'Avocado',
  'Banana',
  'Blackberry',
  'Blueberry',
  'Cherry',
  'Coconut',
  'Date',
  'Dragon Fruit',
  'Elderberry',
  'Fig',
  'Grape',
  'Grapefruit',
  'Guava',
  'Honeydew',
  'Kiwi',
  'Lemon',
  'Lime',
  'Mango',
  'Nectarine',
  'Orange',
  'Papaya',
  'Passion Fruit',
  'Peach',
  'Pear',
  'Persimmon',
  'Pineapple',
  'Plum',
  'Pomegranate',
  'Quince',
  'Raspberry',
  'Strawberry',
  'Tangerine',
  'Watermelon',
];

const fakeSearch = (query: string): Promise<string[]> =>
  new Promise((resolve) => {
    window.setTimeout(() => {
      const q = query.toLowerCase();
      resolve(FRUITS.filter((f) => f.toLowerCase().includes(q)));
    }, 400);
  });

export default function ListboxAsyncPreview() {
  const [search, setSearch] = useState('');
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
          <Listbox.SearchInput
            placeholder="Search fruits"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            isLoading={isLoading}
          />
          {results.map((fruit) => (
            <Listbox.Option key={fruit} value={fruit}>
              {fruit}
            </Listbox.Option>
          ))}
          {!isLoading && results.length === 0 && (
            <Listbox.Empty>No results</Listbox.Empty>
          )}
        </Listbox.Options>
      </Listbox>
    </div>
  );
}
