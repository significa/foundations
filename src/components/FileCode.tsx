import { INDEX, type RegistryEntry } from '../../__registry__/index';
import { PreviewBox } from 'components/PreviewBox';

interface FileCodeProps {
  path: RegistryEntry;
  filename?: string;
}

export function FileCode({ path, filename }: FileCodeProps) {
  if (Object.hasOwn(INDEX, path) && INDEX[path].code) {
    const Component = INDEX[path].code;

    return (
      <div className="relative nx-mt-6 first:nx-mt-0 [&>.nextra-code-block>pre]:max-h-[48rem]">
        {filename && (
          <div className="[&+*>pre]:pt-12 [&+*>div]:top-8 backdrop-blur-[6px] nx-absolute nx-top-0 nx-z-[1] nx-w-full nx-truncate nx-rounded-t-xl nx-bg-primary-700/5 nx-py-2 nx-px-4 nx-text-xs nx-text-gray-700 dark:nx-bg-primary-300/10 dark:nx-text-gray-200">
            {filename}
          </div>
        )}
        <Component />
      </div>
    );
  } else {
    return (
      <PreviewBox>
        <div className="opacity-60 text-sm">Unable to load file code</div>
      </PreviewBox>
    );
  }
}
