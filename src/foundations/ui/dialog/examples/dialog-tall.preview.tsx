import { Button } from '@/foundations/ui/button/button';
import { Dialog } from '@/foundations/ui/dialog/dialog';

export default function DialogTallPreview() {
  return (
    <Dialog>
      <Dialog.Trigger asChild>
        <Button variant="outline">Open Tall Dialog</Button>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Title>Very Tall Dialog</Dialog.Title>
        <div>
          {Array(20)
            .fill(null)
            .map((_, index) => (
              <p key={index} className="mb-4">
                This is paragraph {index + 1}. Lorem ipsum dolor sit amet,
                consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut
                labore et dolore magna aliqua.
              </p>
            ))}
        </div>
        <Dialog.Actions>
          <Dialog.Close asChild>
            <Button variant="outline">Close</Button>
          </Dialog.Close>
        </Dialog.Actions>
      </Dialog.Content>
    </Dialog>
  );
}
