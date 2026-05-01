import {
  type ColorToken,
  SCHEME_TOKENS,
  type Scheme,
  SEMANTIC_TOKENS,
  TOKEN_LABELS,
  type TokenValues,
} from './schemes';

const isValidColor = (value: string): boolean => {
  if (!value.trim()) return false;
  if (typeof CSS === 'undefined' || !CSS.supports) return true;
  return CSS.supports('color', value);
};

type TokenInputProps = {
  value: string;
  onChange: (value: string) => void;
  side: 'light' | 'dark';
  label: string;
};

const TokenInput = ({ value, onChange, side, label }: TokenInputProps) => {
  const valid = isValidColor(value);
  return (
    <div className="relative flex-1">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        spellCheck={false}
        autoComplete="off"
        autoCorrect="off"
        aria-label={`${label} (${side})`}
        aria-invalid={!valid || undefined}
        className="focus-visible:ring-(length:--ring-width) h-7 w-full rounded-md border border-border bg-background py-0 pr-7 pl-2 font-mono text-2xs outline-none ring-ring aria-invalid:border-error"
      />
      <span
        aria-hidden="true"
        className="absolute top-1/2 right-1.5 size-4 -translate-y-1/2 rounded-sm border border-border"
        style={{ backgroundColor: valid ? value : 'transparent' }}
      />
    </div>
  );
};

type SchemeEditorProps = {
  scheme: Scheme;
  overrides: Partial<Record<ColorToken, TokenValues>>;
  onTokenChange: (
    token: ColorToken,
    side: 'light' | 'dark',
    value: string
  ) => void;
};

type TokenRowProps = {
  token: ColorToken;
  scheme: Scheme;
  overrides: Partial<Record<ColorToken, TokenValues>>;
  onTokenChange: SchemeEditorProps['onTokenChange'];
};

const TokenRow = ({
  token,
  scheme,
  overrides,
  onTokenChange,
}: TokenRowProps) => {
  const values = overrides[token] ?? scheme.colors[token];
  const label = TOKEN_LABELS[token];
  return (
    <div className="flex flex-col gap-1">
      <span className="font-medium text-2xs text-foreground-secondary">
        {label}
      </span>
      <div className="flex gap-1.5">
        <TokenInput
          label={label}
          side="light"
          value={values.light}
          onChange={(v) => onTokenChange(token, 'light', v)}
        />
        <TokenInput
          label={label}
          side="dark"
          value={values.dark}
          onChange={(v) => onTokenChange(token, 'dark', v)}
        />
      </div>
    </div>
  );
};

const SchemeEditor = ({
  scheme,
  overrides,
  onTokenChange,
}: SchemeEditorProps) => {
  return (
    <div className="flex flex-col gap-2.5 p-3">
      {SCHEME_TOKENS.map((token) => (
        <TokenRow
          key={token}
          token={token}
          scheme={scheme}
          overrides={overrides}
          onTokenChange={onTokenChange}
        />
      ))}
      <div className="-mx-3 mt-1 border-border border-t pt-3">
        <span className="font-medium text-2xs text-foreground-secondary uppercase tracking-wider">
          Semantic
        </span>
      </div>
      {SEMANTIC_TOKENS.map((token) => (
        <TokenRow
          key={token}
          token={token}
          scheme={scheme}
          overrides={overrides}
          onTokenChange={onTokenChange}
        />
      ))}
    </div>
  );
};

export { SchemeEditor };
