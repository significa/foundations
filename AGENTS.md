# AGENTS.md

Guidelines for agentic coding agents working in this repository.

---

## Commands

All commands use **pnpm** (v10.32.1, Node ≥ 22.12.0).

| Command             | Purpose                                                            |
| ------------------- | ------------------------------------------------------------------ |
| `pnpm dev`          | Start Astro dev server (Pagefind/search does not work)             |
| `pnpm dev:pagefind` | Build + index Pagefind + dev server (search works)                 |
| `pnpm build`        | Production build; `postbuild` runs Pagefind indexing automatically |
| `pnpm preview`      | Serve the production build locally                                 |
| `pnpm check`        | **CI gate** — must pass before merging (see below)                 |
| `pnpm lint`         | `biome lint --write --unsafe .`                                    |
| `pnpm format`       | Biome format (non-Astro) + Prettier format (Astro)                 |
| `pnpm types:check`  | `astro sync && tsc -noEmit`                                        |

### CI gate

`pnpm check` runs three things in sequence:

1. `biome ci` — lints and checks formatting for all non-Astro files
2. `prettier --check "**/*.astro"` — checks formatting for Astro files
3. `pnpm types:check` — full TypeScript type check

**Always run `pnpm check` after making changes.** Fix all errors before considering a task done.

### No test framework

There is no Jest, Vitest, or Playwright setup. There is no test command.

---

## TypeScript

- Config extends `astro/tsconfigs/strict` — the strictest Astro preset.
- Path aliases: `@/*` → `src/*`, `~/*` → repo root.
- Use `import type` for all type-only imports.
- Avoid `any`. If unavoidable, add a `// biome-ignore lint/suspicious/noExplicitAny: <reason>` comment.
- Prefer `interface` for component props and object shapes; use `type` for unions, mapped types, and simple aliases.
- Component props must extend the underlying HTML element type:
  - `React.ComponentPropsWithRef<'button'>` when forwarding refs
  - `React.ComponentPropsWithoutRef<'div'>` otherwise
  - `React.ComponentProps<typeof SomeComponent>` to inherit another component's props
- Use the React 19 ref-as-prop pattern — do **not** use `forwardRef`.
- Use the React 19 `use()` hook instead of `useContext()` to consume context.
- Pass context directly as JSX: `<MyContext value={ctx}>` (no `.Provider`).
- Use the `satisfies` operator when helpful for type narrowing without widening.
- CSS custom properties on React elements are covered by the global augmentation in `src/react.d.ts` — pass `--token` props inline without type errors.

---

## Code Style

### Formatting rules

|                 | `.ts` / `.tsx` files | `.astro` files |
| --------------- | -------------------- | -------------- |
| Tool            | Biome                | Prettier       |
| Quotes          | Single               | Double         |
| Semicolons      | Always               | Always         |
| Line width      | 80                   | 128            |
| Indent          | 2 spaces             | 2 spaces       |
| Trailing commas | ES5                  | ES5            |
| JSX quotes      | Double               | Double         |

### Imports

- Biome's `organizeImports` runs automatically — do not manually sort imports.
- Use `import type { Foo }` for type-only imports; never mix types and values in a single `import`.
- For Phosphor icons inside `*.preview.tsx` files use the SSR-safe subpath:
  `import { IconName } from '@phosphor-icons/react/dist/ssr'`
- Import `cn` and `cva` from `@/lib/utils/classnames`, not directly from their packages.

### Exports

- Use **named exports only**. No default exports, except in `*.preview.tsx` files.
- Export components at the bottom of the file: `export { ComponentName }`.
- For compound components, use `Object.assign` then re-export under the clean name:
  ```ts
  const CompoundDialog = Object.assign(Dialog, { Content: DialogContent, Trigger: DialogTrigger });
  export { CompoundDialog as Dialog };
  ```
- Export types with `export type { MyType }` when the file also has value exports.

---

## Naming Conventions

| Thing                  | Convention                        | Example                               |
| ---------------------- | --------------------------------- | ------------------------------------- |
| Files & folders        | `kebab-case`                      | `use-scroll-lock.ts`, `color-picker/` |
| React components       | `PascalCase`                      | `ColorPicker`, `DialogContent`        |
| Hooks                  | `camelCase`, `use` prefix         | `useScrollLock`, `useMatchMedia`      |
| Utilities / functions  | `camelCase`                       | `composeRefs`, `clamp`                |
| CVA style objects      | `<name>Style` or `<name>Variants` | `buttonStyle`, `badgeVariants`        |
| Context objects        | `<Name>Context`                   | `TooltipContext`                      |
| Context consumer hooks | `use<Name>Context`                | `useTooltipContext`                   |
| Sub-components         | Prefixed with parent              | `DialogContent`, `TooltipTrigger`     |

---

## Component Patterns

### Astro vs React

- Use **Astro components** (`.astro`) for static layouts, documentation infrastructure, and anything with no client-side interactivity.
- Use **React components** (`.tsx`) for all interactive UI and for everything inside `src/foundations/`.
- Hydrate React inside Astro pages using Astro island directives:
  - `client:load` — hydrate immediately
  - `client:idle` — hydrate when browser is idle
  - `client:visible` — hydrate when scrolled into view
  - `transition:persist` — preserve state across Astro view transitions

### Variants with CVA

All variant-based styling uses `cva` (imported from `@/lib/utils/classnames`):

```ts
const buttonStyle = cva({
  base: "inline-flex items-center ...",
  variants: {
    variant: { primary: "...", secondary: "..." },
    size: { sm: "...", md: "...", lg: "..." },
  },
  defaultVariants: { variant: "primary", size: "md" },
});
```

Use `cn(...)` (also from `@/lib/utils/classnames`) for conditional/merged class names.

### `asChild` / Slot

Polymorphic rendering uses the project's own `Slot` primitive (no Radix dependency):

```ts
import { Slot } from "@/foundations/components/slot/slot";
```

Any component accepting `asChild` renders as its child element when the prop is true, merging all props.

### State via `data-*` attributes

Communicate UI state through `data-*` attributes, not class toggling:

```tsx
data-open={isOpen}
data-selected={isSelected || undefined}
data-status="active"
```

Target these in Tailwind with selectors like `data-[open=true]:opacity-100`.

### Controlled + Uncontrolled

Support both patterns by merging internal and external state:

```ts
const open = propsOpen ?? internalOpen;
```

---

## Foundations Entry Structure

Every documented primitive lives in `src/foundations/<category>/<name>/` and follows this layout:

```
src/foundations/<category>/<name>/
  <name>.tsx          # The source component, hook, or utility
  page.mdx            # Documentation page (required frontmatter: title, description)
  examples/
    <name>.preview.tsx              # Default interactive example
    <name>-<variant>.preview.tsx    # Additional variants
```

### Preview files (`*.preview.tsx`)

- Must have `export default function` as the main export.
- May export `export const meta = { layout: 'centered' | 'fullscreen' | 'padded', mode: 'inline' | 'iframe' }`.
- Available at `/preview/<slug>` during development.
- Use `/dist/ssr` Phosphor icon imports to avoid SSR errors.

---

## Styling

- Tailwind CSS v4 via `@tailwindcss/vite` — **no `tailwind.config.js`**.
- Theme tokens are defined as CSS custom properties in `src/foundations/setup/globals-data-attr.css` using `@theme` blocks.
- All colors use OKLCH: `--color-background`, `--color-foreground`, `--color-accent`, `--color-border`, `--color-ring`.
- Dark mode is toggled via `[data-theme="dark"]` on the `<html>` element — not via a CSS class or `prefers-color-scheme`.
- Global styles live in `src/styles/global.css`; markdown-specific styles in `src/styles/markdown.css`.

---

## Environment Variables

Defined in `astro.config.ts` via Astro's typed env schema. Copy `.env.example` to `.env` to get started.

| Variable       | Description                                         |
| -------------- | --------------------------------------------------- |
| `POSTHOG_KEY`  | PostHog analytics key (use `"development"` locally) |
| `POSTHOG_HOST` | PostHog host URL (use `"development"` locally)      |

Analytics only runs in production (`import.meta.env.PROD` gate).
