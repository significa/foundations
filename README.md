# Foundations

Foundations is an opinionated collection of components, patterns, and guidelines for building consistent and accessible user interfaces. Inspired by projects like [shadcn](https://ui.shadcn.com/), the goal is to allow developers to copy components into their projects and customize them as needed, or simply take inspiration to build their own versions.

## Table of Contents

- [Getting Started](#getting-started)
- [Authoring](#authoring)
  - [Folder Structure](#folder-structure)
  - [Code Previews](#code-previews)
  - [Metadata](#metadata)
  - [Markdown](#markdown)
- [License](#license)
- [Contributing](#contributing)
- [Acknowledgments](#acknowledgments)

## Getting Started

To get the project running locally, follow these steps:

1. **Clone the repository:**

   ```bash
   git clone https://github.com/significa/foundations.git
   cd foundations
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Run the development server:**

   ```bash
   npm run dev
   ```

   This will start the server and watch for changes.

## Authoring

Documentation pages are written in `.mdx` format. For a complete example, check out [markdown-example](./markdown-example.mdx).

### Folder Structure

The `src/foundations` folder contains all the foundational content and follows a specific convention:

- `page.mdx`: Used to create the documentation page.
- Source files are added to the root of the folder.
- Any file ending in `.preview.tsx` will be made available as a preview (see "Code Previews" below).

### Code Previews

While developing, you can visit `/preview/[slug]` to open a `[slug].preview.tsx` file. This makes it easier to develop in isolation.

### Metadata

Each `page.mdx` file should include the following metadata structure:

| Field          | Type   | Description                                         | Required |
| -------------- | ------ | --------------------------------------------------- | -------- |
| `title`        | String | The title of the docs page.                         | Yes      |
| `description`  | String | A brief description of the docs page.               | No       |
| `preview`      | String | The slug of a "Code Preview" to be used as a cover. | No       |
| `files`        | Array  | List of source files.                               | No       |
| `dependencies` | Array  | List of dependencies, each with a name and href.    | No       |

#### Dependencies Structure

Each dependency in the `dependencies` array should have the following structure:

| Field  | Type   | Description                 | Required |
| ------ | ------ | --------------------------- | -------- |
| `name` | String | The name of the dependency. | Yes      |
| `href` | String | URL to the dependency.      | Yes      |

This metadata is crucial for ensuring that each documentation page is properly structured and provides all necessary information.

### Markdown

We use [GitHub Flavored Markdown Spec](https://github.github.com/gfm/). Additionally, several components are available for use without importing them. For a complete list of these components, refer to the `markdown.tsx` file.

## License

This project is licensed under the [GPL-3.0 License](https://www.gnu.org/licenses/gpl-3.0.en.html).

## Acknowledgments

[Shadcn](https://ui.shadcn.com/) and [Lucia Auth](https://lucia-auth.com/) serve as excellent examples of robust foundational platforms that people can use to build upon. This project aspires to combine the strengths of both by offering ready-to-use components alongside detailed guides and recipes, simplifying the process of kickstarting any project.

---

For more details, refer to the codebase and explore the components and patterns provided.

Built by [Significa](https://significa.co).
