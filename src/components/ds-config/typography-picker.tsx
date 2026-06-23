import { useEffect, useMemo, useState } from "react";

import { Listbox } from "@/foundations/ui/listbox/listbox";
import type { FontCategory, StoredFont } from "./storage";
import { type FontMeta, fetchCatalog, loadGoogleFont } from "./use-fonts-catalog";

const FEATURED_BY_CATEGORY: Record<FontCategory, FontMeta[]> = {
  "sans-serif": [
    { family: "Inter", category: "sans-serif" },
    { family: "Geist", category: "sans-serif" },
    { family: "IBM Plex Sans", category: "sans-serif" },
    { family: "Manrope", category: "sans-serif" },
    { family: "Outfit", category: "sans-serif" },
    { family: "Work Sans", category: "sans-serif" },
  ],
  serif: [
    { family: "Playfair Display", category: "serif" },
    { family: "Lora", category: "serif" },
    { family: "EB Garamond", category: "serif" },
    { family: "Source Serif 4", category: "serif" },
  ],
  monospace: [
    { family: "Geist Mono", category: "monospace" },
    { family: "IBM Plex Mono", category: "monospace" },
    { family: "JetBrains Mono", category: "monospace" },
    { family: "Space Mono", category: "monospace" },
  ],
  display: [
    { family: "Playfair Display", category: "serif" },
    { family: "Bricolage Grotesque", category: "sans-serif" },
  ],
  handwriting: [],
};

const DEFAULT_FEATURED: FontMeta[] = [
  ...FEATURED_BY_CATEGORY["sans-serif"].slice(0, 3),
  ...FEATURED_BY_CATEGORY.serif.slice(0, 2),
  ...FEATURED_BY_CATEGORY.monospace.slice(0, 1),
];

const MAX_RESULTS = 100;

interface TypographyPickerProps {
  value: StoredFont | null;
  onChange: (value: StoredFont | null) => void;
  placeholder?: string;
  nullLabel?: string;
  /** When set, featured + filter results are scoped to this category. */
  category?: FontCategory;
}

const TypographyPicker = ({
  value,
  onChange,
  placeholder = "System default",
  nullLabel = "System default",
  category,
}: TypographyPickerProps) => {
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const featured = useMemo<FontMeta[]>(() => {
    const base = category ? FEATURED_BY_CATEGORY[category] : DEFAULT_FEATURED;
    if (!value) return base;
    if (base.some((f) => f.family === value.family)) return base;
    return [value, ...base];
  }, [value, category]);

  const [results, setResults] = useState<FontMeta[]>(featured);

  useEffect(() => {
    if (!search) {
      setResults(featured);
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
          .filter((font) => (category ? font.category === category : true))
          .filter((font) => font.family.toLowerCase().includes(query))
          .slice(0, MAX_RESULTS),
      );

      setIsLoading(false);
    }, 200);

    return () => {
      cancelled = true;
      window.clearTimeout(handle);
    };
  }, [search, featured, category]);

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
      <Listbox.Trigger placeholder={placeholder}>{value?.family}</Listbox.Trigger>
      <Listbox.Options>
        <Listbox.SearchInput
          placeholder="Search fonts"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          isLoading={isLoading}
        />
        {!search && (
          <>
            <Listbox.Option value={null}>{nullLabel}</Listbox.Option>
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
