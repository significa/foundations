'use client';

import { Button } from '@/foundations/ui/button/button';
import { Dialog } from '@/foundations/ui/dialog/dialog';

export default function DialogTopPreview() {
  return (
    <Dialog>
      <Dialog.Trigger asChild>
        <Button variant="outline">Open at the top</Button>
      </Dialog.Trigger>
      <Dialog.Content align="top">
        <Dialog.Title>Unsaved changes</Dialog.Title>
        <Dialog.Description>
          Are you sure you want to leave this page?
        </Dialog.Description>
        <Dialog.Actions>
          <Button>Confirm</Button>
          <Dialog.Close asChild>
            <Button variant="outline">Cancel</Button>
          </Dialog.Close>
        </Dialog.Actions>
      </Dialog.Content>
    </Dialog>
  );
}
