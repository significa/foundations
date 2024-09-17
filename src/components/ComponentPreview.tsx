import { useMemo, Suspense } from 'react';
import { Tabs } from 'nextra/components';
import { FileCode } from 'components/FileCode';
import { PreviewBox } from 'components/PreviewBox';
import { INDEX, RegistryEntry } from '../../.registry';

interface ComponentPreviewProps {
  path: RegistryEntry;
}

export function ComponentPreview({ path }: ComponentPreviewProps) {
  const Source = useMemo(() => {
    if (Object.hasOwn(INDEX, path)) {
      const Component = INDEX[path].source;

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
