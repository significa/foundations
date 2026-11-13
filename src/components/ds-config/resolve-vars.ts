import {
  COLOR_TOKENS,
  type ColorToken,
  colorFor,
  DEFAULT_SCHEME_ID,
  type Scheme,
  type TokenValues,
} from "./schemes.ts";
import {
  FONT_SLOTS,
  FONT_VARS,
  RING_DEFAULT,
  type StoredFont,
  type StoredFonts,
} from "./storage.ts";
import { RADIUS_DEFAULT, radiusValue, STYLE_TOKENS, type Style, styleValue } from "./styles.ts";
import { fallbackFor } from "./use-fonts-catalog.ts";

export const tokenVar = (token: ColorToken) => `--color-${token}`;

export const lightDark = ({ light, dark }: TokenValues) => `light-dark(${light}, ${dark})`;

export const fontFamilyValue = (font: StoredFont) =>
  `'${font.family}', ${fallbackFor(font.category)}`;

/** Every variable the config can set on <html>, so applying a map can clear the rest. */
export const MANAGED_VARS: string[] = [
  ...COLOR_TOKENS.map(tokenVar),
  ...STYLE_TOKENS,
  "--radius",
  "--ring-width",
  ...FONT_SLOTS.map((slot) => FONT_VARS[slot]),
];

type ConfigInput = {
  scheme: Scheme;
  style: Style;
  overrides: Partial<Record<ColorToken, TokenValues>>;
  radiusStep: number;
  ringWidth: number;
  fonts: StoredFonts;
};

/** The variables to set on <html>; anything absent falls back to the setup CSS. */
export const resolveVars = ({
  scheme,
  style,
  overrides,
  radiusStep,
  ringWidth,
  fonts,
}: ConfigInput): Record<string, string> => {
  const vars: Record<string, string> = {};

  for (const token of COLOR_TOKENS) {
    const override = overrides[token];
    if (scheme.id === DEFAULT_SCHEME_ID && !override) continue;
    vars[tokenVar(token)] = lightDark(override ?? colorFor(scheme, token));
  }

  // After the colours: a colour a style owns wins over the scheme and any edit
  for (const [name, value] of Object.entries(style.tokens)) {
    if (value !== undefined) vars[name] = styleValue(value);
  }

  if (radiusStep !== RADIUS_DEFAULT) vars["--radius"] = radiusValue(radiusStep);
  if (ringWidth !== RING_DEFAULT) vars["--ring-width"] = `${ringWidth}px`;

  for (const slot of FONT_SLOTS) {
    const font = fonts[slot];
    if (font) vars[FONT_VARS[slot]] = fontFamilyValue(font);
  }

  return vars;
};
