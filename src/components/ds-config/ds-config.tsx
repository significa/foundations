import {
  ArrowCounterClockwiseIcon,
  ArrowLeftIcon,
  PencilSimpleIcon,
  SlidersHorizontalIcon,
} from '@phosphor-icons/react/dist/ssr';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { CopyButton } from '@/components/copy-button';
import { IconButton } from '@/foundations/ui/button/button';
import { Popover } from '@/foundations/ui/popover/popover';
import { Slider } from '@/foundations/ui/slider/slider';
import { Tooltip } from '@/foundations/ui/tooltip/tooltip';
import {
  DEFAULT_PAIRING,
  findPairing,
  PAIRINGS,
  type Pairing,
} from './pairings';
import { SchemeEditor } from './scheme-editor';
import {
  COLOR_TOKENS,
  type ColorToken,
  DEFAULT_SCHEME,
  DEFAULT_SCHEME_ID,
  SCHEMES,
  type Scheme,
  type TokenValues,
} from './schemes';
import {
  EMPTY_FONTS,
  type FontSlot,
  RADIUS_DEFAULT,
  RING_DEFAULT,
  readStored,
  type StoredFont,
  type StoredFonts,
  writeStored,
} from './storage';
import { TypographyEditor } from './typography-editor';
import { fallbackFor, loadGoogleFont } from './use-fonts-catalog';

const RADIUS_STEP_REM = 0.0625;
const RADIUS_MAX = 4;
const RING_MIN = 2;
const RING_MAX = 6;

type View = 'presets' | 'edit-colors' | 'edit-fonts';

const setRoot = (prop: string, value: string) =>
  document.documentElement.style.setProperty(prop, value);

const removeRoot = (prop: string) =>
  document.documentElement.style.removeProperty(prop);

const tokenVar = (token: ColorToken) => `--color-${token}`;

const lightDark = ({ light, dark }: TokenValues) =>
  `light-dark(${light}, ${dark})`;

const valuesEqual = (a: TokenValues, b: TokenValues) =>
  a.light === b.light && a.dark === b.dark;

const resolveToken = (
  scheme: Scheme,
  overrides: Partial<Record<ColorToken, TokenValues>>,
  token: ColorToken
): TokenValues => overrides[token] ?? scheme.colors[token];

const fontFamilyValue = (font: StoredFont) =>
  `'${font.family}', ${fallbackFor(font.category)}`;

const FONT_SLOTS: FontSlot[] = ['heading', 'body', 'ui', 'mono'];
const FONT_VAR: Record<FontSlot, string> = {
  heading: '--font-heading',
  body: '--font-body',
  ui: '--font-ui',
  mono: '--font-mono',
};

const DSConfig = () => {
  const stored = readStored();
  const initialScheme =
    SCHEMES.find((s) => s.id === stored.schemeId) ?? DEFAULT_SCHEME;

  const [schemeId, setSchemeId] = useState(initialScheme.id);
  const [overrides, setOverrides] = useState<
    Partial<Record<ColorToken, TokenValues>>
  >(stored.overrides);
  const [radiusStep, setRadiusStep] = useState(stored.radiusStep);
  const [ringWidth, setRingWidth] = useState(stored.ringWidth);
  const [fonts, setFonts] = useState<StoredFonts>(stored.fonts);
  const [view, setView] = useState<View>('presets');

  const scheme = useMemo(
    () => SCHEMES.find((s) => s.id === schemeId) ?? DEFAULT_SCHEME,
    [schemeId]
  );

  const activePairing = useMemo(() => findPairing(fonts), [fonts]);

  const apply = useCallback(() => {
    for (const token of COLOR_TOKENS) {
      const onDefaultScheme = scheme.id === DEFAULT_SCHEME_ID;
      const overridden = overrides[token];
      if (onDefaultScheme && !overridden) {
        removeRoot(tokenVar(token));
      } else {
        const values = resolveToken(scheme, overrides, token);
        setRoot(tokenVar(token), lightDark(values));
      }
    }
    if (radiusStep !== RADIUS_DEFAULT) {
      setRoot('--radius', `${radiusStep * RADIUS_STEP_REM}rem`);
    } else {
      removeRoot('--radius');
    }
    if (ringWidth !== RING_DEFAULT) {
      setRoot('--ring-width', `${ringWidth}px`);
    } else {
      removeRoot('--ring-width');
    }
    for (const slot of FONT_SLOTS) {
      const font = fonts[slot];
      if (font) {
        setRoot(FONT_VAR[slot], fontFamilyValue(font));
      } else {
        removeRoot(FONT_VAR[slot]);
      }
    }
  }, [scheme, overrides, radiusStep, ringWidth, fonts]);

  useEffect(() => {
    const ensureFontsLoaded = () => {
      for (const slot of FONT_SLOTS) {
        const font = fonts[slot];
        if (font) loadGoogleFont(font.family);
      }
    };
    ensureFontsLoaded();
    document.addEventListener('astro:after-swap', ensureFontsLoaded);
    return () =>
      document.removeEventListener('astro:after-swap', ensureFontsLoaded);
  }, [fonts]);

  useEffect(() => {
    apply();
    document.addEventListener('astro:after-swap', apply);
    return () => document.removeEventListener('astro:after-swap', apply);
  }, [apply]);

  useEffect(() => {
    writeStored({ schemeId, overrides, radiusStep, ringWidth, fonts });
  }, [schemeId, overrides, radiusStep, ringWidth, fonts]);

  const handleTokenChange = (
    token: ColorToken,
    side: 'light' | 'dark',
    value: string
  ) => {
    setOverrides((prev) => {
      const current = prev[token] ?? scheme.colors[token];
      const updated: TokenValues = { ...current, [side]: value };
      // If the override now matches the scheme's value for this token, drop it.
      if (valuesEqual(updated, scheme.colors[token])) {
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

  const handleResetOverrides = () => setOverrides({});

  const handleResetFonts = () => setFonts(EMPTY_FONTS);

  const handleReset = () => {
    setSchemeId(DEFAULT_SCHEME_ID);
    setOverrides({});
    setRadiusStep(RADIUS_DEFAULT);
    setRingWidth(RING_DEFAULT);
    setFonts(EMPTY_FONTS);
  };

  const generateCSSOverrides = () => {
    const tokenLines: string[] = [];
    for (const token of COLOR_TOKENS) {
      const current = resolveToken(scheme, overrides, token);
      if (valuesEqual(current, DEFAULT_SCHEME.colors[token])) continue;
      tokenLines.push(`  ${tokenVar(token)}: ${lightDark(current)};`);
    }
    if (radiusStep !== RADIUS_DEFAULT) {
      tokenLines.push(`  --radius: ${radiusStep * RADIUS_STEP_REM}rem;`);
    }
    if (ringWidth !== RING_DEFAULT) {
      tokenLines.push(`  --ring-width: ${ringWidth}px;`);
    }
    for (const slot of FONT_SLOTS) {
      const font = fonts[slot];
      if (!font) continue;
      tokenLines.push(`  ${FONT_VAR[slot]}: ${fontFamilyValue(font)};`);
    }

    if (tokenLines.length === 0) return '/* No customizations */';
    return `:root {\n${tokenLines.join('\n')}\n}`;
  };

  const headerLabel: Record<View, string> = {
    presets: 'Design system',
    'edit-colors': 'Edit colors',
    'edit-fonts': 'Edit fonts',
  };

  const headerReset: Record<View, () => void> = {
    presets: handleReset,
    'edit-colors': handleResetOverrides,
    'edit-fonts': handleResetFonts,
  };

  const headerResetLabel: Record<View, string> = {
    presets: 'Reset to defaults',
    'edit-colors': 'Reset overrides',
    'edit-fonts': 'Reset fonts',
  };

  const isEditing = view !== 'presets';

  return (
    <Popover placement="bottom-end">
      <Popover.Trigger asChild>
        <IconButton
          variant="ghost"
          size="sm"
          aria-label="Design system configuration"
        >
          <SlidersHorizontalIcon />
        </IconButton>
      </Popover.Trigger>
      <Popover.Content className="w-80 p-0 pb-1">
        <div className="flex items-center gap-2 border-border border-b px-3 py-2">
          {isEditing && (
            <IconButton
              variant="ghost"
              size="xs"
              aria-label="Back to presets"
              onClick={() => setView('presets')}
            >
              <ArrowLeftIcon />
            </IconButton>
          )}
          <span className="flex-1 font-medium text-sm">
            {headerLabel[view]}
          </span>
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

        {view === 'edit-colors' && (
          <SchemeEditor
            scheme={scheme}
            overrides={overrides}
            onTokenChange={handleTokenChange}
          />
        )}

        {view === 'edit-fonts' && (
          <TypographyEditor fonts={fonts} onFontChange={handleFontChange} />
        )}

        {view === 'presets' && (
          <div className="flex flex-col divide-y divide-border">
            <div className="flex flex-col gap-2 p-3">
              <div className="flex items-center justify-between">
                <span className="font-medium text-xs">Scheme</span>
                <IconButton
                  variant="ghost"
                  size="xs"
                  aria-label="Edit colors"
                  onClick={() => setView('edit-colors')}
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
                      className="focus-visible:ring-(length:--ring-width) size-6 cursor-pointer rounded-full outline-none ring-ring transition"
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
              <div className="flex items-center justify-between">
                <span className="font-medium text-xs">Typography</span>
                <IconButton
                  variant="ghost"
                  size="xs"
                  aria-label="Edit fonts"
                  onClick={() => setView('edit-fonts')}
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
                <span className="font-medium text-xs">Radius</span>
                <span className="text-foreground-secondary text-xs tabular-nums">
                  {radiusStep * RADIUS_STEP_REM}rem
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
                <Slider.Thumb
                  aria-label="Radius"
                  aria-valuetext={`${radiusStep} pixels`}
                />
              </Slider>
            </div>

            <div className="flex flex-col gap-3 p-3">
              <div className="flex items-center justify-between">
                <span className="font-medium text-xs">Focus ring</span>
                <span className="text-foreground-secondary text-xs tabular-nums">
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

type PairingTileProps = {
  pairing: Pairing;
  isActive: boolean;
  onSelect: (pairing: Pairing) => void;
};

const SLOT_LABELS: Record<FontSlot, string> = {
  heading: 'Heading',
  body: 'Body',
  ui: 'UI',
  mono: 'Mono',
};

const PairingTile = ({ pairing, isActive, onSelect }: PairingTileProps) => {
  const headingFont = pairing.fonts.heading ?? pairing.fonts.body;
  const uiFont = pairing.fonts.ui ?? pairing.fonts.body;

  // Lazy-load preview fonts only when the popover is open.
  useEffect(() => {
    if (headingFont) loadGoogleFont(headingFont.family);
    if (uiFont) loadGoogleFont(uiFont.family);
  }, [headingFont, uiFont]);

  const headingFamily = headingFont
    ? fontFamilyValue(headingFont)
    : 'var(--font-heading)';
  const uiFamily = uiFont ? fontFamilyValue(uiFont) : 'var(--font-ui)';

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
          className="focus-visible:ring-(length:--ring-width) flex h-12 cursor-pointer flex-col items-center justify-center gap-0.5 rounded-md border border-border bg-background px-2 outline-none ring-ring transition hover:bg-background-secondary"
          style={{ opacity: isActive ? 1 : 0.5 }}
        >
          <span
            aria-hidden="true"
            className="font-semibold text-sm leading-none"
            style={{ fontFamily: headingFamily }}
          >
            Aa
          </span>
          <span
            className="text-2xs text-foreground-secondary leading-none"
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
                <div
                  key={slot}
                  className="flex items-center justify-between gap-4"
                >
                  <span className="text-background">{f.family}</span>
                  <span className="text-right text-background/50">
                    {SLOT_LABELS[slot]}{' '}
                  </span>
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
