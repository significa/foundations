import type { ColorToken } from "./schemes.ts";

export const RADIUS_DEFAULT = 2;
export const RADIUS_STEP_REM = 0.0625;

export const radiusValue = (step: number) => `${step * RADIUS_STEP_REM}rem`;

export const STYLE_TOKENS = [
  "--shadow-control",
  "--shadow-control-pressed",
  "--shadow-panel",
  "--press-scale",
  "--press-offset",
  "--control-height-xs",
  "--control-height-sm",
  "--control-height-md",
  "--control-height-lg",
  "--color-control",
] as const;

type StyleToken = (typeof STYLE_TOKENS)[number];

// Shadow layers are listed one per entry so the exported CSS can put each on its own line
type StyleValue = string | readonly string[];

export type Style = {
  id: string;
  label: string;
  description: string;
  radiusStep?: number;
  tokens: Partial<Record<StyleToken, StyleValue>>;
};

export const DEFAULT_STYLE_ID = "default";

export const DEFAULT_STYLE: Style = {
  id: DEFAULT_STYLE_ID,
  label: "Default",
  description: "The values in the setup file.",
  tokens: {},
};

export const STYLES: Style[] = [
  DEFAULT_STYLE,
  {
    id: "flat",
    label: "Flat",
    description:
      "No shadow, only the border. Buttons don't shrink when pressed. Use `0 0 transparent` rather than `none`: Tailwind combines this value with the focus ring into one `box-shadow`, and `none` would make the browser drop both.",
    tokens: {
      "--shadow-control": "0 0 transparent",
      "--shadow-control-pressed": "0 0 transparent",
      "--shadow-panel": "0 0 transparent",
      "--press-scale": "1",
      "--press-offset": "0px",
    },
  },
  {
    id: "raised",
    label: "Raised",
    description:
      "A light line along the top, a darker bottom edge and a soft shadow, so controls look like they stand off the page. Pressed buttons move down 1px instead of shrinking. Primary and destructive buttons share the same edge, so the top line shows on them too; keep it faint if that's too bright on your accent.",
    tokens: {
      "--shadow-control": [
        "inset 0 1px 0 light-dark(oklch(100% 0 0 / 0.9), oklch(100% 0 0 / 0.06))",
        "0 1px 0 light-dark(oklch(0% 0 0 / 0.08), oklch(0% 0 0 / 0.4))",
        "0 2px 3px oklch(0% 0 0 / 0.07)",
      ],
      "--shadow-control-pressed": "inset 0 1px 1px oklch(0% 0 0 / 0.06)",
      "--shadow-panel": [
        "0 1px 0 light-dark(oklch(0% 0 0 / 0.06), oklch(0% 0 0 / 0.4))",
        "0 2px 4px oklch(0% 0 0 / 0.05)",
      ],
      "--press-scale": "1",
      "--press-offset": "1px",
    },
  },
  {
    id: "embossed",
    label: "Embossed",
    description:
      "Controls have no fill of their own, so they take the colour of whatever is behind them. A thin white outline inside the border makes them look pressed into the page.",
    tokens: {
      "--color-control": "transparent",
      "--shadow-control": [
        "inset 0 0 0 1px light-dark(oklch(100% 0 0 / 0.9), oklch(100% 0 0 / 0.08))",
        "0 1px 0 oklch(0% 0 0 / 0.07)",
      ],
      "--shadow-control-pressed": "inset 0 1px 2px oklch(0% 0 0 / 0.08)",
      "--shadow-panel": "0 1px 0 oklch(0% 0 0 / 0.07)",
      "--press-scale": "1",
      "--press-offset": "1px",
    },
  },
  {
    id: "chunky",
    label: "Chunky",
    description:
      "Taller controls, rounder corners and a solid ledge under each control. Pressed buttons drop onto the ledge.",
    radiusStep: 4,
    tokens: {
      "--shadow-control": "0 3px 0 light-dark(oklch(0% 0 0 / 0.16), oklch(0% 0 0 / 0.5))",
      "--shadow-control-pressed": "0 0 transparent",
      "--shadow-panel": "0 3px 0 light-dark(oklch(0% 0 0 / 0.08), oklch(0% 0 0 / 0.4))",
      "--press-scale": "1",
      "--press-offset": "3px",
      "--control-height-xs": "1.75rem",
      "--control-height-sm": "2.25rem",
      "--control-height-md": "2.75rem",
      "--control-height-lg": "3.25rem",
    },
  },
];

export const findStyle = (id: string): Style => STYLES.find((s) => s.id === id) ?? DEFAULT_STYLE;

export const styleValue = (value: StyleValue): string =>
  typeof value === "string" ? value : value.join(", ");

/** The value a style sets for a colour token, or undefined when the scheme owns it. */
export const styleColor = (style: Style, token: ColorToken): string | undefined => {
  const entry = Object.entries(style.tokens).find(([name]) => name === `--color-${token}`);
  return entry?.[1] === undefined ? undefined : styleValue(entry[1]);
};

const declaration = (name: string, value: StyleValue) =>
  typeof value === "string"
    ? `  ${name}: ${value};`
    : `  ${name}:\n${value.map((layer) => `    ${layer}`).join(",\n")};`;

/** `--x: value;` lines for a style's tokens, ready to go inside `@theme { … }`. */
export const styleDeclarations = (style: Style): string[] =>
  Object.entries(style.tokens).flatMap(([name, value]) =>
    value === undefined ? [] : [declaration(name, value)],
  );

/** The block a consumer pastes to get the style. Shadows are baked at build time, so it's `@theme`. */
export const styleCss = (style: Style): string => {
  const lines = styleDeclarations(style);
  if (style.radiusStep !== undefined) lines.push(`  --radius: ${radiusValue(style.radiusStep)};`);
  return `@theme {\n${lines.join("\n")}\n}`;
};
