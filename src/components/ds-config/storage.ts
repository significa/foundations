import {
  type ColorToken,
  DEFAULT_SCHEME_ID,
  type TokenValues,
} from './schemes';

const STORAGE_KEY = 'foundations-ds-config';

export const RADIUS_DEFAULT = 2;
export const RING_DEFAULT = 4;

export type FontCategory =
  | 'sans-serif'
  | 'serif'
  | 'monospace'
  | 'display'
  | 'handwriting';

export type StoredFont = { family: string; category: FontCategory };

export type FontSlot = 'heading' | 'body' | 'ui' | 'mono';

export type StoredFonts = Record<FontSlot, StoredFont | null>;

export const EMPTY_FONTS: StoredFonts = {
  heading: null,
  body: null,
  ui: null,
  mono: null,
};

export type StoredConfig = {
  schemeId: string;
  overrides: Partial<Record<ColorToken, TokenValues>>;
  radiusStep: number;
  ringWidth: number;
  fonts: StoredFonts;
};

export const DEFAULT_STORED_CONFIG: StoredConfig = {
  schemeId: DEFAULT_SCHEME_ID,
  overrides: {},
  radiusStep: RADIUS_DEFAULT,
  ringWidth: RING_DEFAULT,
  fonts: EMPTY_FONTS,
};

// Pre-schemes shape: { accent: 'Blue', radiusStep, ringWidth }.
type LegacyConfig = {
  accent: string;
  radiusStep?: number;
  ringWidth?: number;
};

// Single-font shape that preceded the heading/body/mono triple.
type SingleFontConfig = {
  schemeId: string;
  overrides: Partial<Record<ColorToken, TokenValues>>;
  radiusStep: number;
  ringWidth: number;
  font: StoredFont | null;
};

const LEGACY_LABEL_TO_SCHEME_ID: Record<string, string> = {
  Contrast: 'default',
  Red: 'gruvbox',
  Orange: 'gruvbox',
  Yellow: 'solarized',
  Green: 'forest',
  Blue: 'nord',
  Purple: 'dracula',
  Pink: 'rose',
};

const isLegacy = (raw: unknown): raw is LegacyConfig =>
  typeof raw === 'object' &&
  raw !== null &&
  'accent' in raw &&
  !('schemeId' in raw);

const isSingleFont = (raw: unknown): raw is SingleFontConfig =>
  typeof raw === 'object' &&
  raw !== null &&
  'schemeId' in raw &&
  'font' in raw &&
  !('fonts' in raw);

export const readStored = (): StoredConfig => {
  if (typeof window === 'undefined') return DEFAULT_STORED_CONFIG;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STORED_CONFIG;
    const parsed: unknown = JSON.parse(raw);
    if (isLegacy(parsed)) {
      return {
        schemeId: LEGACY_LABEL_TO_SCHEME_ID[parsed.accent] ?? DEFAULT_SCHEME_ID,
        overrides: {},
        radiusStep: parsed.radiusStep ?? RADIUS_DEFAULT,
        ringWidth: parsed.ringWidth ?? RING_DEFAULT,
        fonts: EMPTY_FONTS,
      };
    }
    if (isSingleFont(parsed)) {
      return {
        schemeId: parsed.schemeId,
        overrides: parsed.overrides,
        radiusStep: parsed.radiusStep,
        ringWidth: parsed.ringWidth,
        fonts: { ...EMPTY_FONTS, body: parsed.font },
      };
    }
    const next = parsed as Partial<StoredConfig>;
    return {
      ...DEFAULT_STORED_CONFIG,
      ...next,
      fonts: { ...EMPTY_FONTS, ...(next.fonts ?? {}) },
    };
  } catch {
    return DEFAULT_STORED_CONFIG;
  }
};

export const writeStored = (config: StoredConfig) => {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch {
    // ignore quota / private-mode failures
  }
};
