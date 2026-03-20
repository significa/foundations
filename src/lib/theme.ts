export const THEME_STORAGE_KEY = 'foundations-theme';

export type Theme = 'light' | 'dark';

export function isTheme(value: unknown): value is Theme {
  return value === 'light' || value === 'dark';
}
