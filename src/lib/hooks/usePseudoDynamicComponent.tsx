import { useMemo, createElement, isValidElement, type ComponentType } from 'react';
import dynamic from 'next/dynamic';

function isReactComponent(Component: unknown): boolean {
  return !!Component && isValidElement(createElement(Component as ComponentType));
}

// Webpack doesn't support fully dynamic paths,
// we have to give it some sort of root path to "hook onto to"
// https://webpack.js.org/api/module-methods/#dynamic-expressions-in-import
//
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function pseudoDynamicImport(path: string): Promise<any> {
  if (path.startsWith('@/foundations/')) {
    const transformedPath = path.replace('@/foundations/', '');

    return import(`@/foundations/${transformedPath}`);
  }

  return new Promise<void>((resolve) => resolve());
}

const NotFound = () => <div className="opacity-60 text-sm">Unable to load dynamic component</div>;

export function usePseudoDynamicComponent(path: string): ComponentType {
  return useMemo(() => {
    if (!path || path.length === 0) {
      return NotFound;
    }

    return dynamic(() =>
      pseudoDynamicImport(path)
        .then((m) => {
          if (isReactComponent(m.default)) {
            return m.default;
          }

          const name = path.split('/').reverse()[0];
          if (isReactComponent(m[name])) {
            return m[name];
          }

          throw new Error(`No component found in path '${path}'`);
        })
        .catch((e) => {
          console.error(e);

          return NotFound;
        })
    );
  }, [path]);
}
