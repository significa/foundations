import type { FontCategory } from './storage';

export type FontMeta = { family: string; category: FontCategory };

const KNOWN_CATEGORIES: ReadonlySet<string> = new Set([
  'sans-serif',
  'serif',
  'monospace',
  'display',
  'handwriting',
]);

const isFontCategory = (value: string): value is FontCategory =>
  KNOWN_CATEGORIES.has(value);

const loaded = new Set<string>();
let catalogPromise: Promise<FontMeta[]> | null = null;

type CatalogRow = {
  family: string;
  category: string;
  type?: string;
};

export const fetchCatalog = (): Promise<FontMeta[]> => {
  if (catalogPromise) return catalogPromise;
  catalogPromise = fetch('https://api.fontsource.org/v1/fonts')
    .then((response) => response.json())
    .then((rows: CatalogRow[]) =>
      rows
        .filter((row) => row.type === undefined || row.type === 'google')
        .filter((row) => isFontCategory(row.category))
        .map(
          (row): FontMeta => ({
            family: row.family,
            category: row.category as FontCategory,
          })
        )
    )
    .catch(() => []);
  return catalogPromise;
};

const familyToUrlParam = (family: string) =>
  encodeURIComponent(family).replace(/%20/g, '+');

export const loadGoogleFont = (family: string) => {
  if (loaded.has(family)) return;
  loaded.add(family);
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = `https://fonts.googleapis.com/css2?family=${familyToUrlParam(family)}:wght@400;500;600;700&display=swap`;
  document.head.appendChild(link);
};

export const fallbackFor = (category: FontCategory): string => {
  if (category === 'serif') return 'ui-serif, Georgia, serif';
  if (category === 'monospace') return 'ui-monospace, Menlo, monospace';
  return 'ui-sans-serif, system-ui, sans-serif';
};
