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

export const DEFAULT_PAIRING_ID = 'default';

export const PAIRINGS: Pairing[] = [
  {
    id: 'default',
    label: 'System',
    fonts: { heading: null, body: null, mono: null },
  },
  {
    id: 'editorial',
    label: 'Editorial',
    fonts: {
      heading: font('Playfair Display', 'serif'),
      body: font('Inter', 'sans-serif'),
      mono: null,
    },
  },
  {
    id: 'humanist',
    label: 'Humanist',
    fonts: {
      heading: font('Lora', 'serif'),
      body: font('Inter', 'sans-serif'),
      mono: null,
    },
  },
  {
    id: 'geometric',
    label: 'Geometric',
    fonts: {
      heading: font('Manrope', 'sans-serif'),
      body: font('Manrope', 'sans-serif'),
      mono: null,
    },
  },
  {
    id: 'tech',
    label: 'Tech',
    fonts: {
      heading: font('Geist', 'sans-serif'),
      body: font('Geist', 'sans-serif'),
      mono: font('Geist Mono', 'monospace'),
    },
  },
  {
    id: 'plex',
    label: 'Plex',
    fonts: {
      heading: font('IBM Plex Sans', 'sans-serif'),
      body: font('IBM Plex Sans', 'sans-serif'),
      mono: font('IBM Plex Mono', 'monospace'),
    },
  },
];

export const DEFAULT_PAIRING: Pairing = PAIRINGS[0];

const sameFont = (a: StoredFont | null, b: StoredFont | null) =>
  (a?.family ?? null) === (b?.family ?? null);

export const fontsEqual = (a: StoredFonts, b: StoredFonts) =>
  sameFont(a.heading, b.heading) &&
  sameFont(a.body, b.body) &&
  sameFont(a.mono, b.mono);

export const findPairing = (fonts: StoredFonts): Pairing | null =>
  PAIRINGS.find((p) => fontsEqual(p.fonts, fonts)) ?? null;
