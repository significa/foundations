import { MouseScrollIcon } from '@phosphor-icons/react';

import { Stack } from '@/foundations/components/stack/stack';
import { Divider } from '@/foundations/ui/divider/divider';

const StackStickPositionPreview = () => {
  return (
    <div className="relative grid grid-cols-2 gap-8 py-[100vh]">
      <div className="absolute top-[50vh] flex w-full items-center justify-center gap-1 text-foreground-secondary">
        <MouseScrollIcon />
        Scroll down
      </div>
      <div className="absolute bottom-[50vh] flex w-full items-center justify-center gap-1 text-foreground-secondary">
        <MouseScrollIcon />
        Scroll up
      </div>
      <div>
        <Stack stick="top">
          {[1, 2, 3].map((num) => (
            <Stack.Item key={num} className="bg-background px-4">
              <Stack.Header>
                <div className="py-2 font-medium">Section {num}</div>
                <Divider />
              </Stack.Header>
              <div className="py-2 text-foreground-secondary">
                This section demonstrates the default top sticky behavior where
                headers stick to the top of the viewport as you scroll down.
              </div>
            </Stack.Item>
          ))}
        </Stack>
      </div>

      <div>
        <Stack stick="bottom">
          {[1, 2, 3].map((num) => (
            <Stack.Item key={num} className="bg-background px-4">
              <Stack.Header>
                <div className="py-2 font-medium">Section {num}</div>
                <Divider />
              </Stack.Header>
              <div className="py-2 text-foreground-secondary">
                This section shows how headers can stick to the bottom of the
                viewport when using stick=bottom. This is useful for bottom-up
                navigation patterns.
              </div>
            </Stack.Item>
          ))}
        </Stack>
      </div>
    </div>
  );
};

export default StackStickPositionPreview;
