import { useMemo, createElement, isValidElement, type ComponentType } from 'react';
import dynamic from 'next/dynamic';
import { pseudoDynamicImport } from '@/lib/pseudoDynamicImport';

const isReactComponent = (Component: unknown): boolean => {
  return !!Component && isValidElement(createElement(Component as ComponentType));
};

const NotFound = () => <div className="opacity-60 text-sm">Unable to load component</div>;

export const usePseudoDynamicComponent = (path: string) => {
  return useMemo(() => {
    const name = path.split('/').reverse()[0];

    if (!path || path.length === 0) {
      return NotFound;
    }

    return dynamic(() =>
      pseudoDynamicImport(path)
        .then((m) => {
          if (isReactComponent(m.default)) {
            return m.default;
          } else if (isReactComponent(m[name])) {
            return m[name];
          }

          throw new Error('No components found in path');
        })
        .catch((e) => {
          console.error(e);

          return NotFound;
        })
    );
  }, [path]);
};
