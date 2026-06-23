# CLAUDE.md

Guidelines for agentic coding agents working in this repository.

---

## Commands

All commands use **pnpm** (v10.32.1). Node and pnpm are pinned via `mise.toml`
(Node 24, pnpm 10) — run `mise install` after cloning.

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
| `pnpm knip`         | Dead-code / unused-dependency detection                            |

### CI gate

`pnpm check` runs five things in sequence:

1. `biome ci` — lints and checks formatting for all non-Astro files
2. `prettier --check "**/*.astro"` — checks formatting for Astro files
3. `pnpm types:check` — full TypeScript type check
4. `pnpm check:deps` — verifies every component's `page.mdx` declares the cross-Foundations imports it uses (see "Page dependency discipline" below)
5. `pnpm knip` — flags unused files and unused/unlisted dependencies (config in `knip.ts`; unused-export reporting is off because the library surface is intentionally public)

**Always run `pnpm check` after making changes.** Fix all errors before considering a task done.

### No test framework

There is no Jest, Vitest, or Playwright setup. There is no test command.

---

## TypeScript

- Config extends `@significa/tsconfig/astro` (the shared Significa preset). On top of strict mode it enables `noUncheckedIndexedAccess`, `noUnusedLocals`/`noUnusedParameters`, and `verbatimModuleSyntax` — so indexed access is `T | undefined` (guard or narrow it; don't reach for `!`, which the lint forbids), and type-only imports must use `import type`.
- Path aliases: `@/*` → `src/*`, `~/*` → repo root (set in `tsconfig.json`; `jsx`/`jsxImportSource` are overridden back to `react-jsx`/`react` since the preset defaults to `preserve`).
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

Biome config extends the shared `@significa/biome-config` preset (`biome.json`);
the project file adds Astro exclusions, Tailwind class sorting, and a few rule
tweaks. The preset's **lint** rules are adopted as-is, but the **formatter** is
pinned back to the house style below (single quotes, 80-char, ES5 commas) via
overrides in `biome.json`. Dropping those overrides and reformatting the codebase
to the preset's defaults (double quotes, 100-char, trailing-all) is deferred to a
separate, mechanical-only PR.

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
- Always import Phosphor icons from the SSR-safe subpath: `import { IconName } from '@phosphor-icons/react/dist/ssr'`. The root barrel uses a dynamic registry that breaks with Astro SSR and is unreliable under Vite HMR (intermittent `Cannot read properties of undefined (reading 'call')` errors). The `/dist/ssr` build is static ESM, fully tree-shakable, SSR-safe, and HMR-stable.
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

| Thing                  | Convention                | Example                               |
| ---------------------- | ------------------------- | ------------------------------------- |
| Files & folders        | `kebab-case`              | `use-scroll-lock.ts`, `color-picker/` |
| React components       | `PascalCase`              | `ColorPicker`, `DialogContent`        |
| Hooks                  | `camelCase`, `use` prefix | `useScrollLock`, `useMatchMedia`      |
| Utilities / functions  | `camelCase`               | `composeRefs`, `clamp`                |
| CVA style objects      | `<name>Style`             | `buttonStyle`, `badgeStyle`           |
| Context objects        | `<Name>Context`           | `TooltipContext`                      |
| Context consumer hooks | `use<Name>Context`        | `useTooltipContext`                   |
| Sub-components         | Prefixed with parent      | `DialogContent`, `TooltipTrigger`     |

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

CVA style objects are exported only when there's a real composition use case for them — either another primitive in the library extends them (e.g., `IconButton` extends `buttonStyle`, `OTPInput` extends `inputStyle`) or consumers building related primitives need to. Otherwise, keep them private to the file. Don't widen exports for the sake of consistency.

### `asChild` / Slot

Polymorphic rendering uses the project's own `Slot` primitive (no Radix dependency):

```ts
import { Slot } from "@/foundations/components/slot/slot";
```

Any component accepting `asChild` renders as its child element when the prop is true, merging all props.

### State via `data-*` attributes

Communicate UI state through `data-*` attributes, not class toggling. The standard set:

| Attribute          | Values                                           | Used for                                                                      |
| ------------------ | ------------------------------------------------ | ----------------------------------------------------------------------------- |
| `data-state`       | `"open" \| "closed"`                             | Binary open/close (Disclosure, Popover trigger, Listbox trigger, Tooltip)     |
| `data-status`      | `"unmounted" \| "initial" \| "open" \| "closed"` | Transition state from `useElementTransition` (Modal, Drawer, Popover content) |
| `data-selected`    | `true \| undefined`                              | Selected items (Tabs, Listbox option, Calendar day)                           |
| `data-highlighted` | `true \| undefined`                              | Keyboard-highlighted items (Dropdown, Listbox)                                |
| `data-disabled`    | `true \| undefined`                              | Disabled items                                                                |

Boolean states use `true` or `undefined` (omit the attribute when false) so selectors like `data-[selected]:...` work. String states use `data-[state=open]:...`.

```tsx
data-state={open ? 'open' : 'closed'}
data-selected={isSelected || undefined}
data-highlighted={isHighlighted || undefined}
```

Target these in Tailwind with selectors like `data-[state=open]:opacity-100` or `data-selected:bg-accent`.

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

### Page dependency discipline

Every `page.mdx` must declare under `dependencies:` every cross-Foundations import its source files use. The CI script `scripts/check-page-deps.mjs` (run via `pnpm check:deps`) walks each component's source and fails if any `@/foundations/...` import isn't declared. This keeps the docs honest about what a consumer will actually drag in when they copy a component.

Format:

```yaml
dependencies:
  - name: Slot
    href: /components/slot
  - name: composeRefs
    href: /utils/compose-refs
  - name: "@floating-ui/react"
    href: https://floating-ui.com/docs/react
```

Internal hrefs are paths under `src/foundations/` (e.g., `/ui/popover` → `src/foundations/ui/popover/`). Anchors and trailing slashes are stripped during the check — `/utils/math#clamp` and `/utils/math` both match a `utils/math` import. External hrefs (starting with `https://`) are not validated.

Imports from `@/lib/...` (utilities provided by the setup guide) are skipped automatically.

---

## Styling

- Tailwind CSS v4 via `@tailwindcss/vite` — **no `tailwind.config.js`**.
- Theme tokens are defined as CSS custom properties in `src/foundations/setup/globals-data-attr.css` using `@theme` blocks.
- All colors use OKLCH: `--color-background`, `--color-foreground`, `--color-accent`, `--color-border`, `--color-ring`.
- Dark mode is toggled via `[data-theme="dark"]` on the `<html>` element — not via a CSS class or `prefers-color-scheme`.
- Global styles live in `src/styles/global.css`; markdown-specific styles in `src/styles/markdown.css`.

---

## Changelog discipline

Foundations is consumed by copy-paste. After every change, evaluate critically whether it warrants a `src/foundations/changelog/page.mdx` entry. The bar: **a consumer reading the entry should know whether their copy needs updating, how to update it, and why.**

Add an entry when the change affects consumer code:

- A bug fix in a primitive that consumers should apply to their copies.
- A renamed/moved/removed export, prop, or attribute they may target.
- A new token, hook, or pattern that supersedes the old way (with the new way clearly the recommended path).
- A behavior change visible at the call site or in rendered output.

Skip the entry when the change is invisible to consumers:

- Internal renames of unexported symbols.
- Refactors that don't change the public API or rendered output.
- Docs-site infrastructure (the docs app itself, not the library).
- New components — those are documented on their own page; mention in the changelog only if they replace something existing.

Format entries like the "Compound Components" entry (March 2026) — short prose explaining what and why, plus a `diff tsx` block showing the before/after. Lead with bug fixes and required updates; group optional improvements below.
