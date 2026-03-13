import eslintPluginAstro from "eslint-plugin-astro";
import tseslint from "typescript-eslint";

export default [
  // TypeScript and JavaScript files
  ...tseslint.configs.recommended,

  // Astro files
  ...eslintPluginAstro.configs.recommended,

  // General configuration for all files
  {
    files: ["**/*.{js,mjs,cjs,ts,tsx}"],
    rules: {
      // Add your custom rules here
    },
  },

  // Ignore patterns
  {
    ignores: ["dist/**", "node_modules/**", ".astro/**"],
  },
];
