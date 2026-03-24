import { Button } from '@/foundations/ui/button/button';
import { Modal } from '@/foundations/ui/modal/modal';

const ModalPreview = () => {
  return (
    <Modal>
      <Modal.Trigger asChild>
        <Button variant="outline">Open</Button>
      </Modal.Trigger>
      <Modal.Content className="min-w-xs space-y-6 rounded-xl p-4">
        <div className="space-y-1">
          <Modal.Title className="font-semibold">Title</Modal.Title>
          <Modal.Description>Description</Modal.Description>
        </div>
        <Modal.Close asChild>
          <Button variant="outline">Close</Button>
        </Modal.Close>
      </Modal.Content>
    </Modal>
  );
};

export default ModalPreview;
