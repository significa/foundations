import {
  ArrowCounterClockwiseIcon,
  SlidersHorizontalIcon,
} from '@phosphor-icons/react';
import { useState } from 'react';
import { CopyButton } from '@/components/copy-button';
import { IconButton } from '@/foundations/ui/button/button';
import { Popover } from '@/foundations/ui/popover/popover';
import { Slider } from '@/foundations/ui/slider/slider';

type AccentTheme = {
  label: string;
  background: string;
  foreground?: string;
};

const accentThemes: AccentTheme[] = [
  {
    label: 'Contrast',
    background: 'var(--color-foreground)',
    foreground: 'var(--color-background)',
  },
  { label: 'Red', background: 'oklch(0.64 0.21 25)' },
  { label: 'Orange', background: 'oklch(0.7 0.19 48)' },
  {
    label: 'Yellow',
    background: 'oklch(83.84% 0.172 83.57)',
    foreground: 'oklch(0 0 0)',
  },
  { label: 'Green', background: 'oklch(0.70 0.15 162)' },
  { label: 'Blue', background: 'oklch(0.62 0.19 260)' },
  { label: 'Purple', background: 'oklch(0.61 0.22 293)' },
  { label: 'Pink', background: 'oklch(0.66 0.21 354)' },
];

const RADIUS_STEP_REM = 0.0625;
const RADIUS_MAX = 4;
const RADIUS_DEFAULT = 2;

const RING_MIN = 2;
const RING_MAX = 6;
const RING_DEFAULT = 4;

const setRoot = (prop: string, value: string) =>
  document.documentElement.style.setProperty(prop, value);

const removeRoot = (prop: string) =>
  document.documentElement.style.removeProperty(prop);

const DSConfig = () => {
  const [accent, setAccent] = useState<AccentTheme>(accentThemes[0]);
  const [radiusStep, setRadiusStep] = useState(RADIUS_DEFAULT);
  const [ringWidth, setRingWidth] = useState(RING_DEFAULT);

  const handleAccentClick = (theme: AccentTheme) => {
    setAccent(theme);
    setRoot('--color-accent', theme.background);
    setRoot('--color-accent-foreground', theme.foreground ?? 'oklch(100% 0 0)');
  };

  const handleRadiusChange = (step: number) => {
    setRadiusStep(step);
    setRoot('--radius', `${step * RADIUS_STEP_REM}rem`);
  };

  const handleRingChange = (width: number) => {
    setRingWidth(width);
    setRoot('--ring-width', `${width}px`);
  };

  const handleReset = () => {
    removeRoot('--color-accent');
    removeRoot('--color-accent-foreground');
    removeRoot('--radius');
    removeRoot('--ring-width');
    setAccent(accentThemes[0]);
    setRadiusStep(RADIUS_DEFAULT);
    setRingWidth(RING_DEFAULT);
  };

  const generateCSSOverrides = () => {
    const lines: string[] = [];
    if (accent.label !== accentThemes[0].label) {
      lines.push(`  --color-accent: ${accent.background};`);
      lines.push(
        `  --color-accent-foreground: ${accent.foreground ?? 'oklch(100% 0 0)'};`
      );
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
      <Popover.Content className="w-72 p-0">
        <div className="flex items-center gap-2 border-border border-b px-3 py-2">
          <span className="flex-1 font-medium text-sm">Design system</span>
          <IconButton
            variant="ghost"
            size="xs"
            aria-label="Reset to defaults"
            onClick={handleReset}
          >
            <ArrowCounterClockwiseIcon />
          </IconButton>
          <CopyButton content={generateCSSOverrides()} />
        </div>

        <div className="flex flex-col divide-y divide-border">
          <div className="flex flex-col gap-2 p-3">
            <span className="font-medium text-xs">Accent</span>
            <div className="flex flex-wrap gap-1.5">
              {accentThemes.map((theme) => {
                const isActive = accent.label === theme.label;
                return (
                  <button
                    key={theme.label}
                    type="button"
                    aria-label={theme.label}
                    aria-pressed={isActive}
                    onClick={() => handleAccentClick(theme)}
                    className="focus-visible:ring-(length:--ring-width) size-6 cursor-pointer rounded-full outline-none ring-ring transition"
                    style={{
                      backgroundColor: theme.background,
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
              onValueChange={handleRadiusChange}
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
              onValueChange={handleRingChange}
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
