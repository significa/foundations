import { Tabs } from 'nextra/components';
import { FileSource } from '@/components/FileSource';
import { Box } from '@/components/Box';
import { usePseudoDynamicComponent } from '@/lib/hooks/usePseudoDynamicComponent';
import type { RegistryEntry } from '../../__registry__/index';

interface ComponentPreviewProps {
  path: string;
  inline?: boolean;
  withSource?: boolean;
}

function PreviewCanvas({ path, inline }: Omit<ComponentPreviewProps, 'withSource'>) {
  const Component = usePseudoDynamicComponent(path);

  return (
    <Box className={inline ? '' : 'p-0'}>
      {inline && <Component />}
      {!inline && <iframe className="w-full h-full" src={`/app/preview?path=${path}`}></iframe>}
    </Box>
  );
}

export function ComponentPreview({
  path,
  inline = true,
  withSource = true
}: ComponentPreviewProps) {
  if (!withSource) {
    return <PreviewCanvas path={path} inline={inline} />;
  }

  return (
    <Tabs items={['Preview', 'Code']}>
      <Tabs.Tab>
        <PreviewCanvas path={path} inline={inline} />
      </Tabs.Tab>
      <Tabs.Tab>
        <FileSource path={path as RegistryEntry} />
      </Tabs.Tab>
    </Tabs>
  );
}
