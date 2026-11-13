import {
  ArrowCounterClockwiseIcon,
  ArrowLeftIcon,
  PencilSimpleIcon,
  SlidersHorizontalIcon,
} from "@phosphor-icons/react/dist/ssr";
import { useCallback, useEffect, useMemo, useState } from "react";
import { CopyButton } from "#/components/copy-button.tsx";
import { IconButton } from "#/foundations/ui/button/button.tsx";
import { Popover } from "#/foundations/ui/popover/popover.tsx";
import { Slider } from "#/foundations/ui/slider/slider.tsx";
import { Tooltip } from "#/foundations/ui/tooltip/tooltip.tsx";
import { DEFAULT_PAIRING, findPairing, PAIRINGS, type Pairing } from "./pairings.ts";
import { fontFamilyValue, lightDark, MANAGED_VARS, resolveVars, tokenVar } from "./resolve-vars.ts";
import { SchemeEditor } from "./scheme-editor.tsx";
import {
  COLOR_TOKENS,
  type ColorToken,
  colorFor,
  DEFAULT_SCHEME,
  DEFAULT_SCHEME_ID,
  SCHEMES,
  type TokenValues,
} from "./schemes.ts";
import {
  EMPTY_FONTS,
  FONT_SLOTS,
  FONT_VARS,
  type FontSlot,
  RING_DEFAULT,
  readStored,
  type StoredFont,
  type StoredFonts,
  writeStored,
} from "./storage.ts";
import {
  DEFAULT_STYLE_ID,
  findStyle,
  RADIUS_DEFAULT,
  radiusValue,
  STYLES,
  type Style,
  styleColor,
  styleDeclarations,
  styleValue,
} from "./styles.ts";
import { TypographyEditor } from "./typography-editor.tsx";
import { loadGoogleFont } from "./use-fonts-catalog.ts";

const RADIUS_MAX = 4;
const RING_MIN = 2;
const RING_MAX = 6;

type View = "presets" | "edit-colors" | "edit-fonts";

const setRoot = (prop: string, value: string) =>
  document.documentElement.style.setProperty(prop, value);

const removeRoot = (prop: string) => document.documentElement.style.removeProperty(prop);

const valuesEqual = (a: TokenValues, b: TokenValues) => a.light === b.light && a.dark === b.dark;

const DSConfig = () => {
  const stored = readStored();
  const initialScheme = SCHEMES.find((s) => s.id === stored.schemeId) ?? DEFAULT_SCHEME;

  const [schemeId, setSchemeId] = useState(initialScheme.id);
  const [styleId, setStyleId] = useState(findStyle(stored.styleId).id);
  const [overrides, setOverrides] = useState<Partial<Record<ColorToken, TokenValues>>>(
    stored.overrides,
  );
  const [radiusStep, setRadiusStep] = useState(stored.radiusStep);
  const [ringWidth, setRingWidth] = useState(stored.ringWidth);
  const [fonts, setFonts] = useState<StoredFonts>(stored.fonts);
  const [view, setView] = useState<View>("presets");

  const scheme = useMemo(
    () => SCHEMES.find((s) => s.id === schemeId) ?? DEFAULT_SCHEME,
    [schemeId],
  );

  const style = useMemo(() => findStyle(styleId), [styleId]);

  const activePairing = useMemo(() => findPairing(fonts), [fonts]);

  const vars = useMemo(
    () => resolveVars({ scheme, style, overrides, radiusStep, ringWidth, fonts }),
    [scheme, style, overrides, radiusStep, ringWidth, fonts],
  );

  const apply = useCallback(() => {
    for (const name of MANAGED_VARS) {
      const value = vars[name];
      if (value === undefined) {
        removeRoot(name);
      } else {
        setRoot(name, value);
      }
    }
  }, [vars]);

  useEffect(() => {
    const ensureFontsLoaded = () => {
      for (const slot of FONT_SLOTS) {
        const font = fonts[slot];
        if (font) loadGoogleFont(font.family);
      }
    };
    ensureFontsLoaded();
    document.addEventListener("astro:after-swap", ensureFontsLoaded);
    return () => document.removeEventListener("astro:after-swap", ensureFontsLoaded);
  }, [fonts]);

  useEffect(() => {
    apply();
    document.addEventListener("astro:after-swap", apply);
    return () => document.removeEventListener("astro:after-swap", apply);
  }, [apply]);

  useEffect(() => {
    writeStored({ schemeId, styleId, overrides, radiusStep, ringWidth, fonts, vars });
  }, [schemeId, styleId, overrides, radiusStep, ringWidth, fonts, vars]);

  const handleTokenChange = (token: ColorToken, side: "light" | "dark", value: string) => {
    setOverrides((prev) => {
      const current = prev[token] ?? colorFor(scheme, token);
      const updated: TokenValues = { ...current, [side]: value };
      // If the override now matches the scheme's value for this token, drop it.
      if (valuesEqual(updated, colorFor(scheme, token))) {
        const { [token]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [token]: updated };
    });
  };

  const handleFontChange = (slot: FontSlot, next: StoredFont | null) => {
    if (next) loadGoogleFont(next.family);
    setFonts((prev) => ({ ...prev, [slot]: next }));
  };

  const handlePairingSelect = (pairing: Pairing) => {
    for (const slot of FONT_SLOTS) {
      const font = pairing.fonts[slot];
      if (font) loadGoogleFont(font.family);
    }
    setFonts(pairing.fonts);
  };

  const handleStyleSelect = (next: Style) => {
    setStyleId(next.id);
    setRadiusStep(next.radiusStep ?? RADIUS_DEFAULT);
  };

  const handleResetOverrides = () => setOverrides({});

  const handleResetFonts = () => setFonts(EMPTY_FONTS);

  const handleReset = () => {
    setSchemeId(DEFAULT_SCHEME_ID);
    setStyleId(DEFAULT_STYLE_ID);
    setOverrides({});
    setRadiusStep(RADIUS_DEFAULT);
    setRingWidth(RING_DEFAULT);
    setFonts(EMPTY_FONTS);
  };

  const generateCSSOverrides = () => {
    const tokenLines: string[] = [];
    for (const token of COLOR_TOKENS) {
      if (styleColor(style, token) !== undefined) continue;
      const current = overrides[token] ?? colorFor(scheme, token);
      if (valuesEqual(current, colorFor(DEFAULT_SCHEME, token))) continue;
      tokenLines.push(`  ${tokenVar(token)}: ${lightDark(current)};`);
    }
    tokenLines.push(...styleDeclarations(style));
    if (radiusStep !== RADIUS_DEFAULT) {
      tokenLines.push(`  --radius: ${radiusValue(radiusStep)};`);
    }
    if (ringWidth !== RING_DEFAULT) {
      tokenLines.push(`  --ring-width: ${ringWidth}px;`);
    }
    for (const slot of FONT_SLOTS) {
      const font = fonts[slot];
      if (!font) continue;
      tokenLines.push(`  ${FONT_VARS[slot]}: ${fontFamilyValue(font)};`);
    }

    if (tokenLines.length === 0) return "/* No customizations */";
    // @theme, not :root: consumers' shadows are baked at build time
    return `@theme {\n${tokenLines.join("\n")}\n}`;
  };

  const headerLabel: Record<View, string> = {
    presets: "Design system",
    "edit-colors": "Edit colors",
    "edit-fonts": "Edit fonts",
  };

  const headerReset: Record<View, () => void> = {
    presets: handleReset,
    "edit-colors": handleResetOverrides,
    "edit-fonts": handleResetFonts,
  };

  const headerResetLabel: Record<View, string> = {
    presets: "Reset to defaults",
    "edit-colors": "Reset overrides",
    "edit-fonts": "Reset fonts",
  };

  const isEditing = view !== "presets";

  return (
    <Popover placement="bottom-end">
      <Popover.Trigger asChild>
        <IconButton variant="ghost" size="sm" aria-label="Design system configuration">
          <SlidersHorizontalIcon />
        </IconButton>
      </Popover.Trigger>
      <Popover.Content className="w-80 p-0 pb-1">
        <div className="flex items-center gap-2 border-b border-border px-3 py-2">
          {isEditing && (
            <IconButton
              variant="ghost"
              size="xs"
              aria-label="Back to presets"
              onClick={() => setView("presets")}
            >
              <ArrowLeftIcon />
            </IconButton>
          )}
          <span className="flex-1 text-sm font-medium">{headerLabel[view]}</span>
          <IconButton
            variant="ghost"
            size="xs"
            aria-label={headerResetLabel[view]}
            onClick={headerReset[view]}
          >
            <ArrowCounterClockwiseIcon />
          </IconButton>
          <CopyButton content={generateCSSOverrides()} />
        </div>

        {view === "edit-colors" && (
          <SchemeEditor
            scheme={scheme}
            style={style}
            overrides={overrides}
            onTokenChange={handleTokenChange}
          />
        )}

        {view === "edit-fonts" && (
          <TypographyEditor fonts={fonts} onFontChange={handleFontChange} />
        )}

        {view === "presets" && (
          <div className="flex flex-col divide-y divide-border">
            <div className="flex flex-col gap-2 p-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium">Scheme</span>
                <IconButton
                  variant="ghost"
                  size="xs"
                  aria-label="Edit colors"
                  onClick={() => setView("edit-colors")}
                >
                  <PencilSimpleIcon />
                </IconButton>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {SCHEMES.map((s) => {
                  const isActive = scheme.id === s.id;
                  return (
                    <button
                      key={s.id}
                      type="button"
                      aria-label={s.label}
                      aria-pressed={isActive}
                      onClick={() => setSchemeId(s.id)}
                      className="size-6 cursor-pointer rounded-full ring-ring transition outline-none focus-visible:ring-(length:--ring-width)"
                      style={{
                        backgroundColor: lightDark(s.colors.accent),
                        opacity: isActive ? 1 : 0.5,
                      }}
                    />
                  );
                })}
              </div>
            </div>

            <div className="flex flex-col gap-2 p-3">
              <span className="text-xs font-medium">Style</span>
              <div className="grid grid-cols-3 gap-1.5">
                {STYLES.map((s) => (
                  <StyleTile
                    key={s.id}
                    style={s}
                    isActive={style.id === s.id}
                    onSelect={handleStyleSelect}
                  />
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2 p-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium">Typography</span>
                <IconButton
                  variant="ghost"
                  size="xs"
                  aria-label="Edit fonts"
                  onClick={() => setView("edit-fonts")}
                >
                  <PencilSimpleIcon />
                </IconButton>
              </div>
              <Tooltip.Group>
                <div className="grid grid-cols-3 gap-1.5">
                  {PAIRINGS.map((p) => {
                    const isActive = activePairing?.id === p.id;
                    return (
                      <PairingTile
                        key={p.id}
                        pairing={p}
                        isActive={isActive}
                        onSelect={handlePairingSelect}
                      />
                    );
                  })}
                </div>
              </Tooltip.Group>
            </div>

            <div className="flex flex-col gap-3 p-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium">Radius</span>
                <span className="text-xs text-foreground-secondary tabular-nums">
                  {radiusValue(radiusStep)}
                </span>
              </div>
              <Slider
                min={0}
                max={RADIUS_MAX}
                step={1}
                value={radiusStep}
                onValueChange={setRadiusStep}
                className="w-full"
              >
                <Slider.Track>
                  <Slider.Range />
                </Slider.Track>
                <Slider.Thumb aria-label="Radius" aria-valuetext={`${radiusStep} pixels`} />
              </Slider>
            </div>

            <div className="flex flex-col gap-3 p-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium">Focus ring</span>
                <span className="text-xs text-foreground-secondary tabular-nums">
                  {ringWidth}px
                </span>
              </div>
              <Slider
                min={RING_MIN}
                max={RING_MAX}
                step={1}
                value={ringWidth}
                onValueChange={setRingWidth}
                className="w-full"
              >
                <Slider.Track>
                  <Slider.Range />
                </Slider.Track>
                <Slider.Thumb
                  aria-label="Focus ring width"
                  aria-valuetext={`${ringWidth} pixels`}
                />
              </Slider>
            </div>
          </div>
        )}
      </Popover.Content>
    </Popover>
  );
};

type StyleTileProps = {
  style: Style;
  isActive: boolean;
  onSelect: (style: Style) => void;
};

// Each tile wears its own style, scoped inline; this works because global.css reads the role shadows at runtime
const StyleTile = ({ style, isActive, onSelect }: StyleTileProps) => {
  const scoped: Record<string, string> = {};
  for (const [name, value] of Object.entries(style.tokens)) {
    if (value !== undefined) scoped[name] = styleValue(value);
  }
  if (style.radiusStep !== undefined) scoped["--radius"] = radiusValue(style.radiusStep);

  return (
    <button
      type="button"
      aria-label={`${style.label} style`}
      aria-pressed={isActive}
      onClick={() => onSelect(style)}
      className="h-8 cursor-pointer rounded-[calc(var(--radius)*3)] border border-border bg-control text-xs font-medium shadow-control ring-ring outline-offset-2 transition outline-none focus-visible:ring-(length:--ring-width) active:translate-y-(--press-offset) active:scale-(--press-scale) active:shadow-control-pressed aria-pressed:outline-2 aria-pressed:outline-foreground aria-pressed:outline-solid"
      style={scoped}
    >
      {style.label}
    </button>
  );
};

type PairingTileProps = {
  pairing: Pairing;
  isActive: boolean;
  onSelect: (pairing: Pairing) => void;
};

const SLOT_LABELS: Record<FontSlot, string> = {
  heading: "Heading",
  body: "Body",
  ui: "UI",
  mono: "Mono",
};

const PairingTile = ({ pairing, isActive, onSelect }: PairingTileProps) => {
  const headingFont = pairing.fonts.heading ?? pairing.fonts.body;
  const uiFont = pairing.fonts.ui ?? pairing.fonts.body;

  // Lazy-load preview fonts only when the popover is open.
  useEffect(() => {
    if (headingFont) loadGoogleFont(headingFont.family);
    if (uiFont) loadGoogleFont(uiFont.family);
  }, [headingFont, uiFont]);

  const headingFamily = headingFont ? fontFamilyValue(headingFont) : "var(--font-heading)";
  const uiFamily = uiFont ? fontFamilyValue(uiFont) : "var(--font-ui)";

  const setSlots = FONT_SLOTS.filter((slot) => pairing.fonts[slot] !== null);
  const isSystem = pairing.id === DEFAULT_PAIRING.id;

  return (
    <Tooltip delayIn={1000}>
      <Tooltip.Trigger asChild>
        <button
          type="button"
          aria-label={pairing.label}
          aria-pressed={isActive}
          onClick={() => onSelect(pairing)}
          data-active={isActive || undefined}
          className="flex h-12 cursor-pointer flex-col items-center justify-center gap-0.5 rounded-md border border-border bg-background px-2 ring-ring transition outline-none hover:bg-background-secondary focus-visible:ring-(length:--ring-width)"
          style={{ opacity: isActive ? 1 : 0.5 }}
        >
          <span
            aria-hidden="true"
            className="text-sm leading-none font-semibold"
            style={{ fontFamily: headingFamily }}
          >
            Aa
          </span>
          <span
            className="text-2xs leading-none text-foreground-secondary"
            style={{ fontFamily: uiFamily }}
          >
            {pairing.label}
          </span>
        </button>
      </Tooltip.Trigger>
      <Tooltip.Content>
        {isSystem ? (
          <span>Inherits your defaults</span>
        ) : (
          <div>
            {setSlots.map((slot) => {
              const f = pairing.fonts[slot];
              if (!f) return null;
              return (
                <div key={slot} className="flex items-center justify-between gap-4">
                  <span className="text-background">{f.family}</span>
                  <span className="text-right text-background/50">{SLOT_LABELS[slot]} </span>
                </div>
              );
            })}
          </div>
        )}
      </Tooltip.Content>
    </Tooltip>
  );
};

export { DSConfig };
