import { useMemo } from 'react';
import { INDEX, type RegistryEntry } from '../../__registry__/index';
import { PreviewBox } from 'components/PreviewBox';

interface FileCodeProps {
  path: RegistryEntry;
}

export function FileCode({ path }: FileCodeProps) {
  const Code = useMemo(() => {
    if (Object.hasOwn(INDEX, path)) {
      const Component = INDEX[path].code;

      return <Component />;
    } else {
      return (
        <PreviewBox>
          <div className="opacity-60">Unable to load Component code</div>
        </PreviewBox>
      );
    }
  }, [path]);

  return Code;
}
