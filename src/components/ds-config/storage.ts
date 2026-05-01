import {
  type ColorToken,
  DEFAULT_SCHEME_ID,
  type TokenValues,
} from './schemes';

const STORAGE_KEY = 'foundations-ds-config';

export const RADIUS_DEFAULT = 2;
export const RING_DEFAULT = 4;

export type StoredConfig = {
  schemeId: string;
  overrides: Partial<Record<ColorToken, TokenValues>>;
  radiusStep: number;
  ringWidth: number;
};

export const DEFAULT_STORED_CONFIG: StoredConfig = {
  schemeId: DEFAULT_SCHEME_ID,
  overrides: {},
  radiusStep: RADIUS_DEFAULT,
  ringWidth: RING_DEFAULT,
};

// Pre-schemes shape: { accent: 'Blue', radiusStep, ringWidth }.
type LegacyConfig = {
  accent: string;
  radiusStep?: number;
  ringWidth?: number;
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
      };
    }
    return { ...DEFAULT_STORED_CONFIG, ...(parsed as Partial<StoredConfig>) };
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
