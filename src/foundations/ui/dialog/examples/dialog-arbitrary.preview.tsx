import { XIcon } from '@phosphor-icons/react/dist/ssr';

import { Button } from '@/foundations/ui/button/button';
import { Dialog } from '@/foundations/ui/dialog/dialog';

export default function DialogArbitraryPreview() {
  return (
    <Dialog>
      <Dialog.Trigger asChild>
        <Button variant="outline">Open Dialog</Button>
      </Dialog.Trigger>
      <Dialog.Content className="p-0">
        <Dialog.Close className="absolute top-3 right-3" asChild>
          <Button variant="outline" size="sm" square>
            <XIcon className="size-4" />
          </Button>
        </Dialog.Close>
        <div className="flex flex-col items-center rounded-2xl p-6">
          <div className="mb-4 size-24 rounded-full border border-border bg-background-secondary" />
          <h2 className="font-semibold text-xl">John Doe</h2>
          <p className="mb-4 text-foreground-secondary text-sm">
            Software Engineer
          </p>
          <div className="mb-6 flex space-x-4">
            <div className="text-center">
              <p className="font-semibold">1.2k</p>
              <p className="text-foreground-secondary text-xs">Followers</p>
            </div>
            <div className="text-center">
              <p className="font-semibold">3.4k</p>
              <p className="text-foreground-secondary text-xs">Following</p>
            </div>
            <div className="text-center">
              <p className="font-semibold">567</p>
              <p className="text-foreground-secondary text-xs">Posts</p>
            </div>
          </div>
          <Button>Follow</Button>
        </div>
      </Dialog.Content>
    </Dialog>
  );
}
