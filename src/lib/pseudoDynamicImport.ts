/* eslint-disable @typescript-eslint/no-explicit-any */

// Webpack doesn't support fully dynamic paths,
// we have to give it some sort of root path to "hook onto to"
// https://webpack.js.org/api/module-methods/#dynamic-expressions-in-import
export function pseudoDynamicImport(path: string, raw = false): Promise<any> {
  if (path === 'tailwind.config.cjs') {
    return import(`!!source-loader!/${'tailwind.config.cjs'}`);
  }

  if (path.startsWith('@/foundations/')) {
    const transformedPath = path.replace('@/foundations/', '');

    if (raw) {
      return import(`!!source-loader!@/foundations/${transformedPath}`);
    } else {
      return import(`@/foundations/${transformedPath}`);
    }
  }

  if (path.startsWith('@/lib/')) {
    const transformedPath = path.replace('@/lib/', '');
    return import(`!!source-loader!@/lib/${transformedPath}`);
  }

  return new Promise<void>((resolve) => resolve());
}
