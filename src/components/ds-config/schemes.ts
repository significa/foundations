export const SCHEME_TOKENS = [
  'background',
  'background-secondary',
  'foreground',
  'foreground-secondary',
  'accent',
  'accent-foreground',
  'border',
] as const;

export const SEMANTIC_TOKENS = ['error', 'warning', 'success', 'info'] as const;

export const COLOR_TOKENS = [...SCHEME_TOKENS, ...SEMANTIC_TOKENS] as const;

export type ColorToken = (typeof COLOR_TOKENS)[number];

export type TokenValues = { light: string; dark: string };

export type Scheme = {
  id: string;
  label: string;
  colors: Record<ColorToken, TokenValues>;
};

export const TOKEN_LABELS: Record<ColorToken, string> = {
  background: 'Background',
  'background-secondary': 'Background secondary',
  foreground: 'Foreground',
  'foreground-secondary': 'Foreground secondary',
  accent: 'Accent',
  'accent-foreground': 'Accent foreground',
  border: 'Border',
  error: 'Error',
  warning: 'Warning',
  success: 'Success',
  info: 'Info',
};

// Semantic defaults match globals-data-attr.css:31-34. Single value, so light = dark.
const SEMANTIC_DEFAULTS: Record<(typeof SEMANTIC_TOKENS)[number], TokenValues> =
  {
    error: {
      light: 'oklch(63.7% 0.237 25.331)',
      dark: 'oklch(63.7% 0.237 25.331)',
    },
    warning: {
      light: 'oklch(79.5% 0.184 86.047)',
      dark: 'oklch(79.5% 0.184 86.047)',
    },
    success: {
      light: 'oklch(69.6% 0.17 162.48)',
      dark: 'oklch(69.6% 0.17 162.48)',
    },
    info: {
      light: 'oklch(62.3% 0.214 259.815)',
      dark: 'oklch(62.3% 0.214 259.815)',
    },
  };

// Mirrors the values declared in src/foundations/setup/globals-data-attr.css.
const DEFAULT_COLORS: Record<ColorToken, TokenValues> = {
  background: { light: 'oklch(100% 0 0)', dark: 'oklch(12% 0 0)' },
  'background-secondary': { light: 'oklch(96% 0 0)', dark: 'oklch(22% 0 0)' },
  foreground: { light: 'oklch(0% 0 0)', dark: 'oklch(95% 0 0)' },
  'foreground-secondary': { light: 'oklch(65% 0 0)', dark: 'oklch(53% 0 0)' },
  accent: { light: 'oklch(0% 0 0)', dark: 'oklch(95% 0 0)' },
  'accent-foreground': { light: 'oklch(100% 0 0)', dark: 'oklch(12% 0 0)' },
  border: { light: 'oklch(94% 0 0)', dark: 'oklch(26% 0 0)' },
  ...SEMANTIC_DEFAULTS,
};

const buildScheme = (
  id: string,
  label: string,
  overrides: Partial<Record<ColorToken, TokenValues>>
): Scheme => ({
  id,
  label,
  colors: { ...DEFAULT_COLORS, ...overrides },
});

export const SCHEMES: Scheme[] = [
  buildScheme('default', 'Default', {}),

  // Warm cream + brown with burnt orange accent.
  buildScheme('gruvbox', 'Gruvbox', {
    background: { light: 'oklch(96% 0.025 85)', dark: 'oklch(25% 0.015 70)' },
    'background-secondary': {
      light: 'oklch(92% 0.03 85)',
      dark: 'oklch(31% 0.02 70)',
    },
    foreground: { light: 'oklch(35% 0.05 60)', dark: 'oklch(88% 0.04 85)' },
    'foreground-secondary': {
      light: 'oklch(55% 0.05 60)',
      dark: 'oklch(68% 0.04 85)',
    },
    accent: { light: 'oklch(58% 0.16 50)', dark: 'oklch(72% 0.14 60)' },
    'accent-foreground': {
      light: 'oklch(96% 0.025 85)',
      dark: 'oklch(25% 0.015 70)',
    },
    border: { light: 'oklch(86% 0.03 85)', dark: 'oklch(36% 0.02 70)' },
  }),

  // Deep forest green palette.
  buildScheme('forest', 'Forest', {
    background: { light: 'oklch(96% 0.015 145)', dark: 'oklch(22% 0.02 150)' },
    'background-secondary': {
      light: 'oklch(92% 0.02 145)',
      dark: 'oklch(28% 0.025 150)',
    },
    foreground: { light: 'oklch(28% 0.04 145)', dark: 'oklch(90% 0.025 130)' },
    'foreground-secondary': {
      light: 'oklch(50% 0.04 145)',
      dark: 'oklch(70% 0.04 130)',
    },
    accent: { light: 'oklch(48% 0.13 145)', dark: 'oklch(74% 0.13 145)' },
    'accent-foreground': {
      light: 'oklch(96% 0.015 145)',
      dark: 'oklch(22% 0.02 150)',
    },
    border: { light: 'oklch(86% 0.02 145)', dark: 'oklch(34% 0.025 150)' },
  }),

  // Frosty cool blue/gray (Nord-inspired).
  buildScheme('nord', 'Nord', {
    background: { light: 'oklch(97% 0.005 240)', dark: 'oklch(28% 0.015 245)' },
    'background-secondary': {
      light: 'oklch(93% 0.01 240)',
      dark: 'oklch(34% 0.02 245)',
    },
    foreground: { light: 'oklch(30% 0.03 245)', dark: 'oklch(90% 0.015 240)' },
    'foreground-secondary': {
      light: 'oklch(52% 0.03 245)',
      dark: 'oklch(70% 0.025 240)',
    },
    accent: { light: 'oklch(55% 0.12 230)', dark: 'oklch(78% 0.10 220)' },
    'accent-foreground': {
      light: 'oklch(97% 0.005 240)',
      dark: 'oklch(28% 0.015 245)',
    },
    border: { light: 'oklch(86% 0.01 240)', dark: 'oklch(40% 0.02 245)' },
  }),

  // Cream/teal (Solarized-inspired). Blue accent in light, yellow in dark.
  buildScheme('solarized', 'Solarized', {
    background: { light: 'oklch(96% 0.025 90)', dark: 'oklch(28% 0.04 230)' },
    'background-secondary': {
      light: 'oklch(92% 0.03 90)',
      dark: 'oklch(34% 0.04 230)',
    },
    foreground: { light: 'oklch(40% 0.04 220)', dark: 'oklch(75% 0.025 90)' },
    'foreground-secondary': {
      light: 'oklch(58% 0.04 220)',
      dark: 'oklch(60% 0.03 90)',
    },
    accent: { light: 'oklch(55% 0.13 230)', dark: 'oklch(80% 0.13 90)' },
    'accent-foreground': {
      light: 'oklch(96% 0.025 90)',
      dark: 'oklch(28% 0.04 230)',
    },
    border: { light: 'oklch(86% 0.03 90)', dark: 'oklch(40% 0.04 230)' },
  }),

  // Soft rose / dusk purple (Rose Pine-inspired).
  buildScheme('rose', 'Rose', {
    background: { light: 'oklch(96% 0.015 30)', dark: 'oklch(25% 0.02 290)' },
    'background-secondary': {
      light: 'oklch(92% 0.02 30)',
      dark: 'oklch(31% 0.025 290)',
    },
    foreground: { light: 'oklch(35% 0.04 280)', dark: 'oklch(90% 0.02 30)' },
    'foreground-secondary': {
      light: 'oklch(55% 0.04 280)',
      dark: 'oklch(70% 0.04 30)',
    },
    accent: { light: 'oklch(60% 0.13 25)', dark: 'oklch(78% 0.12 30)' },
    'accent-foreground': {
      light: 'oklch(96% 0.015 30)',
      dark: 'oklch(25% 0.02 290)',
    },
    border: { light: 'oklch(88% 0.02 30)', dark: 'oklch(36% 0.025 290)' },
  }),

  // Vibrant purple/magenta (Dracula-inspired).
  buildScheme('dracula', 'Dracula', {
    background: { light: 'oklch(96% 0.01 290)', dark: 'oklch(25% 0.03 285)' },
    'background-secondary': {
      light: 'oklch(92% 0.02 290)',
      dark: 'oklch(31% 0.03 285)',
    },
    foreground: { light: 'oklch(28% 0.05 290)', dark: 'oklch(92% 0.015 290)' },
    'foreground-secondary': {
      light: 'oklch(50% 0.04 290)',
      dark: 'oklch(72% 0.03 290)',
    },
    accent: { light: 'oklch(56% 0.20 295)', dark: 'oklch(74% 0.16 295)' },
    'accent-foreground': {
      light: 'oklch(96% 0.01 290)',
      dark: 'oklch(25% 0.03 285)',
    },
    border: { light: 'oklch(86% 0.02 290)', dark: 'oklch(38% 0.03 285)' },
  }),
];

export const DEFAULT_SCHEME_ID = 'default';
export const DEFAULT_SCHEME = SCHEMES[0];
