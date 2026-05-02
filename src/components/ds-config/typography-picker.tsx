import { useEffect, useMemo, useState } from 'react';

import { Listbox } from '@/foundations/ui/listbox/listbox';
import type { StoredFont } from './storage';
import {
  type FontMeta,
  fetchCatalog,
  loadGoogleFont,
} from './use-fonts-catalog';

const FEATURED: FontMeta[] = [
  { family: 'Inter', category: 'sans-serif' },
  { family: 'Geist', category: 'sans-serif' },
  { family: 'IBM Plex Sans', category: 'sans-serif' },
  { family: 'Manrope', category: 'sans-serif' },
  { family: 'Lora', category: 'serif' },
  { family: 'Space Mono', category: 'monospace' },
];

const MAX_RESULTS = 100;

interface TypographyPickerProps {
  value: StoredFont | null;
  onChange: (value: StoredFont | null) => void;
}

const TypographyPicker = ({ value, onChange }: TypographyPickerProps) => {
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const featuredWithCurrent = useMemo<FontMeta[]>(() => {
    if (!value) return FEATURED;
    if (FEATURED.some((f) => f.family === value.family)) return FEATURED;
    return [value, ...FEATURED];
  }, [value]);

  const [results, setResults] = useState<FontMeta[]>(featuredWithCurrent);

  useEffect(() => {
    if (!search) {
      setResults(featuredWithCurrent);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    let cancelled = false;

    const handle = window.setTimeout(async () => {
      const catalog = await fetchCatalog();

      if (cancelled) return;

      const query = search.toLowerCase();

      setResults(
        catalog
          .filter((font) => font.family.toLowerCase().includes(query))
          .slice(0, MAX_RESULTS)
      );

      setIsLoading(false);
    }, 200);

    return () => {
      cancelled = true;
      window.clearTimeout(handle);
    };
  }, [search, featuredWithCurrent]);

  const handleSelect = (next: StoredFont | null) => {
    if (next) loadGoogleFont(next.family);
    onChange(next);
  };

  return (
    <Listbox
      value={value}
      onChange={handleSelect}
      getIsSelected={(a, b) => (a?.family ?? null) === (b?.family ?? null)}
    >
      <Listbox.Trigger placeholder="System default">
        {value?.family}
      </Listbox.Trigger>
      <Listbox.Options>
        <Listbox.SearchInput
          placeholder="Search fonts"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          isLoading={isLoading}
        />
        {!search && (
          <>
            <Listbox.Option value={null}>System default</Listbox.Option>
            <Listbox.Divider />
          </>
        )}
        {results.map((font) => (
          <Listbox.Option key={font.family} value={font}>
            {font.family}
          </Listbox.Option>
        ))}
        {!isLoading && results.length === 0 && (
          <Listbox.Empty>No fonts match &ldquo;{search}&rdquo;</Listbox.Empty>
        )}
      </Listbox.Options>
    </Listbox>
  );
};

export { TypographyPicker };
