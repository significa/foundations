# Foundations

Foundations is an opinionated collection of components, patterns, and guidelines for building consistent and accessible user interfaces. Inspired by projects like [shadcn](https://ui.shadcn.com/), the goal is to allow developers to copy components into their projects and customize them as needed, or simply take inspiration to build their own versions.

---

## Table of Contents

- [Getting Started](#getting-started)
- [Authoring](#authoring)
  - [Folder Structure](#folder-structure)
  - [Pages](#pages)
  - [Code Previews](#code-previews)
- [Commands](#commands)
- [Stack](#stack)
- [Linting & Formatting](#linting--formatting)

---

## Getting Started

1. **Clone the repository:**

   ```bash
   git clone https://github.com/significa/foundations.git
   cd foundations
   ```

2. **Enable pnpm via Corepack:**

   This project uses pnpm (version pinned in `package.json` via `packageManager`). Node version is specified in `.nvmrc`.

   ```bash
   corepack enable pnpm
   ```

3. **Install dependencies:**

   ```bash
   pnpm install
   ```

4. **Set up environment variables:**

   Create a `.env` file at the root:

   ```bash
   POSTHOG_KEY=...
   POSTHOG_HOST=...
   ```

5. **Start the dev server:**

   ```bash
   pnpm dev
   ```

   The site will be available at `http://localhost:4321`.

---

## Authoring

Documentation pages are written in `.mdx` format. All content is driven by [Astro Content Collections](https://docs.astro.build/en/guides/content-collections/), defined in `src/content.config.ts`.

### Folder Structure

The `src/foundations` folder contains all the foundational content and follows a specific convention:

- `page.mdx`: Used to create the documentation page.
- Source files are added to the root of the folder.
- Any file ending in `.preview.tsx` will be made available as a preview (see "Code Previews" below).

### Pages

Each `page.mdx` file should include the following metadata structure:

| Field          | Type   | Description                                         | Required |
| -------------- | ------ | --------------------------------------------------- | -------- |
| `title`        | String | The title of the docs page.                         | Yes      |
| `description`  | String | A brief description of the docs page.               | Yes      |
| `preview`      | String | The slug of a "Code Preview" to be used as a cover. | No       |
| `files`        | Array  | List of source files.                               | No       |
| `dependencies` | Array  | List of dependencies, each with a name and href.    | No       |
| `folder`       | String | Used for sidebar organization.                      | No       |

#### Dependencies Structure

Each dependency in the `dependencies` array should have the following structure:

| Field  | Type   | Description                 | Required |
| ------ | ------ | --------------------------- | -------- |
| `name` | String | The name of the dependency. | Yes      |
| `href` | String | URL to the dependency.      | Yes      |

This metadata is crucial for ensuring that each documentation page is properly structured and provides all necessary information.

### Code Previews

While developing, you can visit `/preview/[slug]` to open a `[slug].preview.tsx` file. This makes it easier to develop in isolation.

A preview file can optionally export a `meta` object to control how it is displayed.

| Option   | Values                                 | Default      | Description                                                          |
| -------- | -------------------------------------- | ------------ | -------------------------------------------------------------------- |
| `layout` | `'centered'` `'fullscreen'` `'padded'` | `'centered'` | Controls how the preview is framed inside its container              |
| `mode`   | `'inline'` `'iframe'`                  | `'iframe'`   | Whether the preview renders inline or inside an iframe in docs pages |

---

## Commands

| Command             | Description                                                          |
| ------------------- | -------------------------------------------------------------------- |
| `pnpm dev`          | Start the Astro development server                                   |
| `pnpm dev:pagefind` | Build the site and start a dev server with Pagefind search working   |
| `pnpm build`        | Build for production (includes Pagefind indexing via `postbuild`)    |
| `pnpm preview`      | Preview the production build locally                                 |
| `pnpm types:check`  | Run `astro sync` and TypeScript type checking                        |
| `pnpm format`       | Auto-format all files (Biome for TS/TSX/CSS, Prettier for `.astro`)  |
| `pnpm lint`         | Run Biome linter with auto-fix (including unsafe fixes)              |
| `pnpm check`        | Full CI check: Biome CI + Prettier check on `.astro` + type checking |

> **Note:** The `pnpm dev` command does not run Pagefind, so the search feature won't work in development unless you run `pnpm dev:pagefind`. See the [Pagefind](#pagefind) section for details.

---

## Stack

| Tool                                        | Purpose                                                                    |
| ------------------------------------------- | -------------------------------------------------------------------------- |
| [Astro](https://astro.build)                | Core framework — static site generation, routing, MDX, content collections |
| [React 19](https://react.dev)               | Interactive islands (component previews, search, menus, etc.)              |
| [Tailwind CSS v4](https://tailwindcss.com)  | Utility-first styling via the Vite plugin                                  |
| [MDX](https://mdxjs.com)                    | Markdown + JSX for content pages (`page.mdx` files)                        |
| [Pagefind](https://pagefind.app)            | Static full-text search, indexed at build time                             |
| [Phosphor Icons](https://phosphoricons.com) | Icon library                                                               |
| [Shiki](https://shiki.matsu.io)             | Syntax highlighting (themes: `kanagawa-lotus` / `github-dark`)             |

---

## Linting & Formatting

This project uses **both** Biome and Prettier — by design, not by accident.

**Biome does not yet support `.astro` files**. Prettier, with the [`prettier-plugin-astro`](https://github.com/withastro/prettier-plugin-astro) plugin, fills that gap. Once Biome adds support for `.astro` files, we should remove Prettier and consolidate on Biome for all formatting and linting needs.

## License

This project is licensed under the [GPL-3.0 License](https://www.gnu.org/licenses/gpl-3.0.en.html).

## Acknowledgments

[Shadcn](https://ui.shadcn.com/) and [Lucia Auth](https://lucia-auth.com/) serve as excellent examples of robust foundational platforms that people can use to build upon. This project aspires to combine the strengths of both by offering ready-to-use components alongside detailed guides and recipes, simplifying the process of kickstarting any project.

---

For more details, refer to the codebase and explore the components and patterns provided.

Built by [Significa](https://significa.co).
