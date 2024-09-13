import { useMemo, Suspense } from 'react';
import { Callout } from 'nextra/components';
import { INDEX } from '../../.mdx-code-files';

interface FileCodeProps {
  path: string;
}

export function FileCode({ path }: FileCodeProps) {
  const Code = useMemo(() => {
    if (Object.hasOwn(INDEX, path)) {
      const Component = INDEX[path];

      return <Component />;
    } else {
      return (
        <Callout type="error" emoji="">
          Component code not found in MDX code files
        </Callout>
      );
    }
  }, [path]);

  return <Suspense>{Code}</Suspense>;
}
