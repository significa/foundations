import { Button } from '@/foundations/ui/button/button';
import { Dialog } from '@/foundations/ui/dialog/dialog';

export default function DialogPreview() {
  return (
    <Dialog>
      <Dialog.Trigger asChild>
        <Button variant="outline">Open</Button>
      </Dialog.Trigger>
      <Dialog.Content className="w-80">
        <Dialog.Title>Unsaved changes</Dialog.Title>
        <Dialog.Description>
          Are you sure you want to leave this page?
        </Dialog.Description>
        <Dialog.Actions>
          <Dialog.Close asChild>
            <Button>Confirm</Button>
          </Dialog.Close>
          <Dialog.Close asChild>
            <Button variant="outline">Cancel</Button>
          </Dialog.Close>
        </Dialog.Actions>
      </Dialog.Content>
    </Dialog>
  );
}
