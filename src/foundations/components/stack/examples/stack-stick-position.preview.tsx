"use client";

import { Divider } from "@/foundations/ui/divider/divider";
import { MouseScrollIcon } from "@phosphor-icons/react";
import {
  Stack,
  StackHeader,
  StackItem,
} from "@/foundations/components/stack/stack";

const StackStickPositionPreview = () => {
  return (
    <div className="relative grid grid-cols-2 gap-8 py-[100vh]">
      <div className="text-muted-foreground absolute top-[50vh] flex w-full items-center justify-center gap-1">
        <MouseScrollIcon />
        Scroll down
      </div>
      <div className="text-muted-foreground absolute bottom-[50vh] flex w-full items-center justify-center gap-1">
        <MouseScrollIcon />
        Scroll up
      </div>
      <div>
        <Stack stick="top">
          {[1, 2, 3].map((num) => (
            <StackItem key={num} className="bg-background px-4">
              <StackHeader>
                <div className="py-2 font-medium">Section {num}</div>
                <Divider />
              </StackHeader>
              <div className="text-muted-foreground py-2">
                This section demonstrates the default top sticky behavior where
                headers stick to the top of the viewport as you scroll down.
              </div>
            </StackItem>
          ))}
        </Stack>
      </div>

      <div>
        <Stack stick="bottom">
          {[1, 2, 3].map((num) => (
            <StackItem key={num} className="bg-background px-4">
              <StackHeader>
                <div className="py-2 font-medium">Section {num}</div>
                <Divider />
              </StackHeader>
              <div className="text-muted-foreground py-2">
                This section shows how headers can stick to the bottom of the
                viewport when using stick=bottom. This is useful for bottom-up
                navigation patterns.
              </div>
            </StackItem>
          ))}
        </Stack>
      </div>
    </div>
  );
};

export default StackStickPositionPreview;
