# CLAUDE.md

Guidelines for agentic coding agents working in this repository.

---

## Commands

All commands use **pnpm** (v10.34.9). Node and pnpm are pinned via `mise.toml`
(Node 26, pnpm 10) — run `mise install` after cloning.

| Command             | Purpose                                                            |
| ------------------- | ------------------------------------------------------------------ |
| `pnpm dev`          | Start Astro dev server (Pagefind/search does not work)             |
| `pnpm dev:pagefind` | Build + index Pagefind + dev server (search works)                 |
| `pnpm build`        | Production build; `postbuild` runs Pagefind indexing automatically |
| `pnpm preview`      | Serve the production build locally                                 |
| `pnpm check`        | **CI gate** — must pass before merging (see below)                 |
| `pnpm lint`         | `biome lint --write --unsafe .`                                    |
| `pnpm format`       | `biome format --write .`                                           |
| `pnpm types:check`  | `astro sync && tsc -noEmit`                                        |
| `pnpm knip`         | Dead-code / unused-dependency detection                            |

### CI gate

`pnpm check` runs four things in sequence:

1. `biome ci` — lints and checks formatting for every file, `.astro` and Markdown included (the preset formats `.md`, so run `pnpm format` after editing docs like this one)
2. `pnpm types:check` — full TypeScript type check
3. `pnpm check:deps` — verifies every component's `page.mdx` declares the cross-Foundations imports it uses (see "Page dependency discipline" below)
4. `pnpm knip` — flags unused files and unused/unlisted dependencies (config in `knip.ts`; unused-export reporting is off because the library surface is intentionally public)

**Always run `pnpm check` after making changes.** Fix all errors before considering a task done.

### No test framework

There is no Jest, Vitest, or Playwright setup. There is no test command.

---

## TypeScript

- Config extends `@significa/ts-standards/tsconfig/astro` (the shared Significa preset). On top of strict mode it enables `noUncheckedIndexedAccess`, `noImplicitReturns`, `noUnusedLocals`/`noUnusedParameters`, and `verbatimModuleSyntax` — so indexed access is `T | undefined` (guard or narrow it; don't reach for `!`, which the lint forbids), every path of a function that returns a value must return (common in `useEffect` cleanups: use an early bare `return;`), and type-only imports must use `import type`. `exactOptionalPropertyTypes` is off.
- The only alias is `#/*` → `src/*`, a Node subpath import in `package.json` (`"imports": { "#/*": "./src/*" }`). There are no tsconfig `paths`. `tsconfig.json` only overrides `jsx`/`jsxImportSource` back to `react-jsx`/`react` since the preset defaults to `preserve`.
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

Biome config extends the shared `@significa/ts-standards/biome/astro` preset (`biome.json`).
Biome and `@significa/ts-standards` are pinned together; bump them as a pair. The
preset covers full `.astro` support and the TS/TSX formatting below, plus the strict rules
(no `any`, no `!`, no `console.log`, no floating promises, no barrel files, kebab-case
filenames). The project file only adds what's Foundations-specific: CSS line width 128,
the `../` import ban, and Tailwind class sorting. Biome is the only linter and formatter;
there is no Prettier.

Lint suppressions live in the component file as a per-line `biome-ignore` with a
specific reason, never in `biome.json` — consumers copy the file and run the same
preset, so the suppression has to travel with it. The one `biome.json` exception
is the vendored PostHog loader (docs-site only), whose inline script ships verbatim.

Tailwind classes are sorted by `nursery/useTailwindSortedClasses` (error, safe
fix) in `class`, `className`, `class:list`, `cn`, `cva`, `clsx` and `tv`. `tailwind.stylesheet` points at
`src/styles/global.css` so custom theme values sort correctly; `pnpm lint` applies
the fixes, and CI fails on unsorted classes.

### Formatting rules

Biome formats everything. `.astro` frontmatter and `<script>` bodies follow the
TS rules; templates use Biome's HTML formatter at the same width, with
`<script>`/`<style>` bodies indented and void elements self-closed (`<meta />`).

| Setting         | Value          |
| --------------- | -------------- |
| Quotes          | Double         |
| Semicolons      | Always         |
| Line width      | 100 (CSS: 128) |
| Indent          | 2 spaces       |
| Trailing commas | All            |
| JSX quotes      | Double         |

### Imports

- Every relative and alias import names the real file, extension included: `./slot.tsx`, `#/foundations/ui/button/button.tsx`. Extensionless `#/` only resolves in Vite; TypeScript, esbuild and Node reject it. Biome's `useImportExtensions` fixes relative imports; `tsc` catches extensionless `#/` (TS2307).
- Cross-directory imports use `#/…`; only same-directory imports are relative (`./x.tsx`). `../` is forbidden by Biome's `noRestrictedImports`, in `.astro` files too.
- Biome's `organizeImports` runs automatically — do not manually sort imports.
- Use `import type { Foo }` for type-only imports; never mix types and values in a single `import`.
- Always import Phosphor icons from the SSR-safe subpath: `import { IconName } from '@phosphor-icons/react/dist/ssr'`. The root barrel uses a dynamic registry that breaks with Astro SSR and is unreliable under Vite HMR (intermittent `Cannot read properties of undefined (reading 'call')` errors). The `/dist/ssr` build is static ESM, fully tree-shakable, SSR-safe, and HMR-stable.
- Import `cn` and `cva` from `#/lib/utils/classnames.ts`, not directly from their packages.

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

All variant-based styling uses `cva` (imported from `#/lib/utils/classnames.ts`):

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

Use `cn(...)` (also from `#/lib/utils/classnames.ts`) for conditional/merged class names.

CVA style objects are exported only when there's a real composition use case for them — either another primitive in the library extends them (e.g., `IconButton` extends `buttonStyle`, `OTPInput` extends `inputStyle`) or consumers building related primitives need to. Otherwise, keep them private to the file. Don't widen exports for the sake of consistency.

### `asChild` / Slot

Polymorphic rendering uses the project's own `Slot` primitive (no Radix dependency):

```ts
import { Slot } from "#/foundations/components/slot/slot.tsx";
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

Every `page.mdx` must declare under `dependencies:` every cross-Foundations import its source files use. The CI script `scripts/check-page-deps.mjs` (run via `pnpm check:deps`) resolves every `#/`, `./` and `../` import in each component's source (everything in its directory except `examples/`, plus its `files:` list), attributes it to the item whose `page.mdx` owns that file, and fails if a different item isn't declared. It also fails on imports of missing files or of code outside `src/foundations/`. This keeps the docs honest about what a consumer will actually drag in when they copy a component.

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

Imports from `#/lib/...` (utilities provided by the setup guide) are skipped automatically.

### llms.txt output

`/<path>/llms.txt` (`src/pages/[...path]/llms.txt.ts`) resolves every MDX component to markdown (`Preview`, `SourceCode`, `SetupCssTabs`, `PropsTable`) and strips MDX imports. The build **fails** if a `<Capitalized` tag survives outside code, so a new MDX component used in a `page.mdx` needs a resolver there. Each page opens with a version stamp (short sha of the last commit touching the page or its source, plus `YYYY-MM-DD`; a shallow clone yields the clone's commit, `unknown` only when git fails entirely) and lists its full dependency closure in copy order, leaves first.

---

## Styling

- Tailwind CSS v4 via `@tailwindcss/vite` — **no `tailwind.config.js`**.
- Theme tokens are defined as CSS custom properties in `src/foundations/setup/globals-data-attr.css` using `@theme` blocks.
- All colors use OKLCH: `--color-background`, `--color-foreground`, `--color-accent`, `--color-border`, `--color-ring`.
- Components paint by role: `bg-surface` for anything raised over the canvas (popovers, menus, dialogs, drawers, toasts), `bg-control` and `shadow-control` for control faces and edges, `bg-background` only for the canvas itself. Never add tokens named after a screen region (`--color-sidebar`); see the Theming guide (`src/foundations/guides/theming/page.mdx`).
- Custom shadow, text or radius names must be registered with tailwind-merge in `src/lib/utils/classnames.ts`, or `cn` keeps both conflicting classes.
- Dark mode is toggled via `[data-theme="dark"]` on the `<html>` element — not via a CSS class or `prefers-color-scheme`.
- Global styles live in `src/styles/global.css`; markdown-specific styles in `src/styles/markdown.css`.

---

## Changelog discipline

Foundations is consumed by copy-paste, and every page's `llms.txt` carries a version stamp (short sha + date) that copies keep in a header comment. Anything a consumer only needs to _know about_ is discoverable by diffing their copy against upstream from that sha, so `src/foundations/changelog/page.mdx` is reserved for changes a consumer **must apply or would be hurt by missing**:

- A bug fix in a primitive that consumers should apply to their copies.
- A breaking rename or removal of an export, prop, attribute, or token they may target.
- A behaviour change visible at the call site or in rendered output.

Everything else (new components, optional improvements, refactors, docs-site infrastructure) gets no entry.

Format entries like the "Compound Components" entry (March 2026) — short prose explaining what and why, plus a `diff tsx` block showing the before/after. The bar: a consumer reading the entry should know whether their copy needs updating, how, and why.
