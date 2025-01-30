"use client";

import {
  InstanceIndexProvider,
  useInstanceIndex,
} from "@/foundations/components/instance-index/instance-index";
import { useState } from "react";
import { Button } from "@/foundations/ui/button/button";

const Item = () => {
  const index = useInstanceIndex();

  return (
    <div className="bg-background-secondary my-2 w-fit rounded-md px-2 py-1 text-xs">
      Instance Index: {index}
    </div>
  );
};

const InstanceIndexPreview = () => {
  const [mount, setMount] = useState(false);
  const [length, setLength] = useState(0);

  return (
    <InstanceIndexProvider onChange={setLength}>
      <div className="flex min-h-88 flex-col gap-4">
        <div className="text-foreground-secondary text-sm">
          Number of Instances: {length}
        </div>
        <Button size="sm" onClick={() => setMount(!mount)}>
          Trigger Tree Change
        </Button>
        <div className="border-border rounded-lg border px-4 py-2 [&_*_*]:ml-4">
          <Item />
          <div>
            <Item />
            {mount && <Item />}
            <div>
              <div>
                <Item />
                <div>
                  <Item />
                  <div>
                    <div>
                      <div>
                        <Item />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Item />
        </div>
      </div>
    </InstanceIndexProvider>
  );
};

export default InstanceIndexPreview;
