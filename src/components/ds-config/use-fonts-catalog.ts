import type { FontCategory } from "./storage";

export type FontMeta = { family: string; category: FontCategory };

const KNOWN_CATEGORIES: ReadonlySet<string> = new Set([
  "sans-serif",
  "serif",
  "monospace",
  "display",
  "handwriting",
]);

const isFontCategory = (value: string): value is FontCategory => KNOWN_CATEGORIES.has(value);

let catalogPromise: Promise<FontMeta[]> | null = null;

type CatalogRow = {
  family: string;
  category: string;
  type?: string;
};

export const fetchCatalog = (): Promise<FontMeta[]> => {
  if (catalogPromise) return catalogPromise;
  catalogPromise = fetch("https://api.fontsource.org/v1/fonts")
    .then((response) => response.json())
    .then((rows: CatalogRow[]) =>
      rows
        .filter((row) => row.type === undefined || row.type === "google")
        .filter((row) => isFontCategory(row.category))
        .map(
          (row): FontMeta => ({
            family: row.family,
            category: row.category as FontCategory,
          }),
        ),
    )
    .catch(() => []);
  return catalogPromise;
};

const familyToUrlParam = (family: string) => encodeURIComponent(family).replace(/%20/g, "+");

// Families shipped locally via @font-face in src/styles/global.css. Loading
// the same family from Google injects a second @font-face with different
// metrics, which the browser will swap to once it arrives — visible as a
// flash and a subtle width/spacing shift on the live page.
const LOCAL_FONT_FAMILIES: ReadonlySet<string> = new Set(["Inter", "Geist Mono"]);

export const loadGoogleFont = (family: string) => {
  if (LOCAL_FONT_FAMILIES.has(family)) return;
  const href = `https://fonts.googleapis.com/css2?family=${familyToUrlParam(family)}:wght@400;500;600;700&display=swap`;
  // Query the DOM rather than a module-level Set: Astro's ClientRouter swaps
  // the page <head> on navigation and drops runtime-injected <link> tags. A
  // Set would keep claiming a font is loaded when its <link> has already been
  // removed, so subsequent pages would render in fallback fonts.
  if (document.querySelector(`link[rel="stylesheet"][href="${href}"]`)) return;
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = href;
  document.head.appendChild(link);
};

export const FONT_FALLBACKS: Record<FontCategory, string> = {
  "sans-serif": "ui-sans-serif, system-ui, sans-serif",
  serif: "ui-serif, Georgia, serif",
  monospace: "ui-monospace, Menlo, monospace",
  display: "ui-sans-serif, system-ui, sans-serif",
  handwriting: "ui-sans-serif, system-ui, sans-serif",
};

export const fallbackFor = (category: FontCategory): string => FONT_FALLBACKS[category];
