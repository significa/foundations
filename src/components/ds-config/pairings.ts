import type { StoredFont, StoredFonts } from './storage';

export type Pairing = {
  id: string;
  label: string;
  fonts: StoredFonts;
};

const font = (
  family: string,
  category: StoredFont['category']
): StoredFont => ({
  family,
  category,
});

const empty: StoredFonts = {
  heading: null,
  body: null,
  ui: null,
  mono: null,
};

export const DEFAULT_PAIRING_ID = 'default';

export const DEFAULT_PAIRING: Pairing = {
  id: DEFAULT_PAIRING_ID,
  label: 'System',
  fonts: { ...empty },
};

export const PAIRINGS: Pairing[] = [
  DEFAULT_PAIRING,
  // Full 3-font editorial: display serif headings, transitional serif body
  // for prose, neo-grotesque sans for chrome. Magazine / publication mood.
  {
    id: 'editorial',
    label: 'Editorial',
    fonts: {
      heading: font('Playfair Display', 'serif'),
      body: font('Source Serif 4', 'serif'),
      ui: font('Inter', 'sans-serif'),
      mono: null,
    },
  },
  // Warm humanist serif for prose + headings, clean sans chrome.
  // Education, healthcare, anything wanting friendliness without losing voice.
  {
    id: 'humanist',
    label: 'Humanist',
    fonts: {
      heading: font('Lora', 'serif'),
      body: font('Lora', 'serif'),
      ui: font('Inter', 'sans-serif'),
      mono: null,
    },
  },
  // Single-face modernist geometric sans. Swiss, clean, opinionated.
  {
    id: 'modernist',
    label: 'Modernist',
    fonts: {
      heading: null,
      body: font('Outfit', 'sans-serif'),
      ui: null,
      mono: null,
    },
  },
  // Industrial body + matching typewriter mono. Studio / agency / raw.
  {
    id: 'brutalist',
    label: 'Brutalist',
    fonts: {
      heading: null,
      body: font('Space Grotesk', 'sans-serif'),
      ui: null,
      mono: font('Space Mono', 'monospace'),
    },
  },
  // Modern tech-brand: paired sans + mono designed as a family.
  {
    id: 'geist',
    label: 'Geist',
    fonts: {
      heading: null,
      body: font('Geist', 'sans-serif'),
      ui: null,
      mono: font('Geist Mono', 'monospace'),
    },
  },
];

const sameFont = (a: StoredFont | null, b: StoredFont | null) =>
  (a?.family ?? null) === (b?.family ?? null);

export const fontsEqual = (a: StoredFonts, b: StoredFonts) =>
  sameFont(a.heading, b.heading) &&
  sameFont(a.body, b.body) &&
  sameFont(a.ui, b.ui) &&
  sameFont(a.mono, b.mono);

export const findPairing = (fonts: StoredFonts): Pairing | null =>
  PAIRINGS.find((p) => fontsEqual(p.fonts, fonts)) ?? null;
