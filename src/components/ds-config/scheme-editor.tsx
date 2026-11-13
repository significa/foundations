import {
  type ColorToken,
  SCHEME_TOKENS,
  type Scheme,
  SEMANTIC_TOKENS,
  TOKEN_LABELS,
  type TokenValues,
} from "./schemes.ts";
import { type Style, styleColor } from "./styles.ts";

const isValidColor = (value: string): boolean => {
  if (!value.trim()) return false;
  if (typeof CSS === "undefined" || !CSS.supports) return true;
  return CSS.supports("color", value);
};

type TokenInputProps = {
  value: string;
  onChange: (value: string) => void;
  side: "light" | "dark";
  label: string;
  disabled?: boolean;
};

const TokenInput = ({ value, onChange, side, label, disabled }: TokenInputProps) => {
  const valid = isValidColor(value);
  return (
    <div className="relative flex-1">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        spellCheck={false}
        autoComplete="off"
        autoCorrect="off"
        aria-label={`${label} (${side})`}
        aria-invalid={!valid || undefined}
        className="h-7 w-full rounded-md border border-border bg-background py-0 pr-7 pl-2 font-mono text-2xs ring-ring outline-none focus-visible:ring-(length:--ring-width) disabled:opacity-50 aria-invalid:border-error"
      />
      <span
        aria-hidden="true"
        className="absolute top-1/2 right-1.5 size-4 -translate-y-1/2 rounded-sm border border-border"
        style={{ backgroundColor: valid ? value : "transparent" }}
      />
    </div>
  );
};

type SchemeEditorProps = {
  scheme: Scheme;
  style: Style;
  overrides: Partial<Record<ColorToken, TokenValues>>;
  onTokenChange: (token: ColorToken, side: "light" | "dark", value: string) => void;
};

type TokenRowProps = {
  token: ColorToken;
  scheme: Scheme;
  style: Style;
  overrides: Partial<Record<ColorToken, TokenValues>>;
  onTokenChange: SchemeEditorProps["onTokenChange"];
};

const TokenRow = ({ token, scheme, style, overrides, onTokenChange }: TokenRowProps) => {
  const label = TOKEN_LABELS[token];
  const owned = styleColor(style, token);
  const locked = owned !== undefined;
  const values =
    owned !== undefined
      ? { light: owned, dark: owned }
      : (overrides[token] ?? scheme.colors[token]);
  return (
    <div className="flex flex-col gap-1">
      <span className="text-2xs font-medium text-foreground-secondary">
        {label}
        {locked && ` · set by the ${style.label} style`}
      </span>
      <div className="flex gap-1.5">
        <TokenInput
          label={label}
          side="light"
          value={values.light}
          disabled={locked}
          onChange={(v) => onTokenChange(token, "light", v)}
        />
        <TokenInput
          label={label}
          side="dark"
          value={values.dark}
          disabled={locked}
          onChange={(v) => onTokenChange(token, "dark", v)}
        />
      </div>
    </div>
  );
};

const SchemeEditor = ({ scheme, style, overrides, onTokenChange }: SchemeEditorProps) => {
  return (
    <div className="flex flex-col gap-2.5 p-3">
      {SCHEME_TOKENS.map((token) => (
        <TokenRow
          key={token}
          token={token}
          scheme={scheme}
          style={style}
          overrides={overrides}
          onTokenChange={onTokenChange}
        />
      ))}
      <div className="-mx-3 mt-1 border-t border-border pt-3 pl-3">
        <span className="text-2xs font-medium tracking-wider text-foreground-secondary uppercase">
          Semantic
        </span>
      </div>
      {SEMANTIC_TOKENS.map((token) => (
        <TokenRow
          key={token}
          token={token}
          scheme={scheme}
          style={style}
          overrides={overrides}
          onTokenChange={onTokenChange}
        />
      ))}
    </div>
  );
};

export { SchemeEditor };
