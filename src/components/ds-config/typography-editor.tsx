import type {
  FontCategory,
  FontSlot,
  StoredFont,
  StoredFonts,
} from './storage';
import { TypographyPicker } from './typography-picker';

type SlotConfig = {
  slot: FontSlot;
  label: string;
  hint: string;
  placeholder: string;
  nullLabel: string;
  category?: FontCategory;
};

const SLOTS: SlotConfig[] = [
  {
    slot: 'heading',
    label: 'Heading',
    hint: 'Used for headings (h1–h6).',
    placeholder: 'Inherit body',
    nullLabel: 'Inherit body',
  },
  {
    slot: 'body',
    label: 'Body',
    hint: 'Used for prose. Default for UI chrome unless UI is set.',
    placeholder: 'System default',
    nullLabel: 'System default',
  },
  {
    slot: 'ui',
    label: 'UI',
    hint: 'Used for chrome (buttons, inputs, menus). Falls back to body.',
    placeholder: 'Inherit body',
    nullLabel: 'Inherit body',
  },
  {
    slot: 'mono',
    label: 'Mono',
    hint: 'Used for code blocks, kbd, and tabular numerics.',
    placeholder: 'System monospace',
    nullLabel: 'System monospace',
    category: 'monospace',
  },
];

type TypographyEditorProps = {
  fonts: StoredFonts;
  onFontChange: (slot: FontSlot, value: StoredFont | null) => void;
};

const TypographyEditor = ({ fonts, onFontChange }: TypographyEditorProps) => {
  return (
    <div className="flex flex-col gap-3 p-3">
      {SLOTS.map((cfg) => (
        <div key={cfg.slot} className="flex flex-col gap-1">
          <span className="font-medium text-xs">{cfg.label}</span>
          <TypographyPicker
            value={fonts[cfg.slot]}
            onChange={(next) => onFontChange(cfg.slot, next)}
            placeholder={cfg.placeholder}
            nullLabel={cfg.nullLabel}
            category={cfg.category}
          />
          <span className="text-2xs text-foreground-secondary">{cfg.hint}</span>
        </div>
      ))}
    </div>
  );
};

export { TypographyEditor };
