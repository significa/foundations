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
  RADIUS_DEFAULT,
  RING_DEFAULT,
  readStored,
  writeStored,
} from './storage';

const RADIUS_STEP_REM = 0.0625;
const RADIUS_MAX = 4;
const RING_MIN = 2;
const RING_MAX = 6;

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
  const [view, setView] = useState<'presets' | 'edit'>('presets');

  const scheme = useMemo(
    () => SCHEMES.find((s) => s.id === schemeId) ?? DEFAULT_SCHEME,
    [schemeId]
  );

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
  }, [scheme, overrides, radiusStep, ringWidth]);

  useEffect(() => {
    apply();
    document.addEventListener('astro:after-swap', apply);
    return () => document.removeEventListener('astro:after-swap', apply);
  }, [apply]);

  useEffect(() => {
    writeStored({ schemeId, overrides, radiusStep, ringWidth });
  }, [schemeId, overrides, radiusStep, ringWidth]);

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

  const handleResetOverrides = () => setOverrides({});

  const handleReset = () => {
    setSchemeId(DEFAULT_SCHEME_ID);
    setOverrides({});
    setRadiusStep(RADIUS_DEFAULT);
    setRingWidth(RING_DEFAULT);
  };

  const generateCSSOverrides = () => {
    const lines: string[] = [];
    for (const token of COLOR_TOKENS) {
      const current = resolveToken(scheme, overrides, token);
      if (valuesEqual(current, DEFAULT_SCHEME.colors[token])) continue;
      lines.push(`  ${tokenVar(token)}: ${lightDark(current)};`);
    }
    if (radiusStep !== RADIUS_DEFAULT) {
      lines.push(`  --radius: ${radiusStep * RADIUS_STEP_REM}rem;`);
    }
    if (ringWidth !== RING_DEFAULT) {
      lines.push(`  --ring-width: ${ringWidth}px;`);
    }
    if (lines.length === 0) return '/* No customizations */';
    return `\n${lines.join('\n')}\n`;
  };

  const editing = view === 'edit';

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
      <Popover.Content className="w-80 p-0">
        <div className="flex items-center gap-2 border-border border-b px-3 py-2">
          {editing && (
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
            {editing ? 'Edit colors' : 'Design system'}
          </span>
          <IconButton
            variant="ghost"
            size="xs"
            aria-label={editing ? 'Reset overrides' : 'Reset to defaults'}
            onClick={editing ? handleResetOverrides : handleReset}
          >
            <ArrowCounterClockwiseIcon />
          </IconButton>
          <CopyButton content={generateCSSOverrides()} />
        </div>

        {editing ? (
          <SchemeEditor
            scheme={scheme}
            overrides={overrides}
            onTokenChange={handleTokenChange}
          />
        ) : (
          <div className="flex flex-col divide-y divide-border">
            <div className="flex flex-col gap-2 p-3">
              <div className="flex items-center justify-between">
                <span className="font-medium text-xs">Scheme</span>
                <IconButton
                  variant="ghost"
                  size="xs"
                  aria-label="Edit colors"
                  onClick={() => setView('edit')}
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

        <div className="border-border border-t p-3">
          <p className="text-foreground-secondary text-xs">
            Copy the snippet and paste it inside your project's{' '}
            <code className="font-medium text-foreground">:root</code> to apply
            this configuration.
          </p>
        </div>
      </Popover.Content>
    </Popover>
  );
};

export { DSConfig };
