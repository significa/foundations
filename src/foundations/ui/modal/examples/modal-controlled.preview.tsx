import { useState } from 'react';

import { Button } from '@/foundations/ui/button/button';
import { Modal } from '@/foundations/ui/modal/modal';

const ModalControlledPreview = () => {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = () => {
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setOpen(false);
    }, 3000);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <Modal
      open={open}
      onOpenChange={(isOpen) => setOpen(isSubmitting ? true : isOpen)}
    >
      <Button onClick={() => setOpen(true)} variant="destructive">
        Delete
      </Button>
      <Modal.Content inert={isSubmitting} className="rounded-xl p-4">
        <Modal.Title className="my-1 font-semibold">Delete Account</Modal.Title>
        <p>Are you sure you want to proceed?</p>
        <div className="mt-4 flex gap-2">
          <Button
            isLoading={isSubmitting}
            onClick={handleSubmit}
            variant="destructive"
          >
            Delete
          </Button>
          <Button onClick={handleCancel}>Cancel</Button>
        </div>
      </Modal.Content>
    </Modal>
  );
};

export default ModalControlledPreview;
