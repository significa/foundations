/**
 * Converts a TitleCase (PascalCase) string to kebab-case.
 * @example titleCaseToKebabCase("HelloWorld") // "hello-world"
 * @example titleCaseToKebabCase("MyComponentName") // "my-component-name"
 */
export function titleCaseToKebabCase(str: string): string {
  return str.replace(/([A-Z])/g, (match, char, offset) => (offset > 0 ? "-" : "") + char.toLowerCase()).toLowerCase();
}
