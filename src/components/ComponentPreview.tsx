import { useMemo } from 'react';
import { Tabs } from 'nextra/components';
import { FileCode } from 'components/FileCode';
import { PreviewBox } from 'components/PreviewBox';
import { INDEX, RegistryEntry } from '../../__registry__';

interface ComponentPreviewProps {
  path: RegistryEntry;
}

export function ComponentPreview({ path }: ComponentPreviewProps) {
  const Source = useMemo(() => {
    if (Object.hasOwn(INDEX, path) && INDEX[path].component) {
      const Component = INDEX[path].component;

      return <Component />;
    } else {
      return <div className="opacity-60">Unable to load component</div>;
    }
  }, [path]);

  return (
    <Tabs items={['Preview', 'Code']}>
      <Tabs.Tab>
        <PreviewBox>{Source}</PreviewBox>
      </Tabs.Tab>
      <Tabs.Tab>
        <FileCode path={path} />
      </Tabs.Tab>
    </Tabs>
  );
}
