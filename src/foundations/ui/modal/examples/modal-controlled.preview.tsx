"use client";

import { Modal, ModalContent, ModalTitle } from "@/foundations/ui/modal/modal";
import { Button } from "@/foundations/ui/button/button";
import { useState } from "react";

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
      <ModalContent inert={isSubmitting} className="rounded-xl p-4">
        <ModalTitle className="my-1 font-semibold">Delete Account</ModalTitle>
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
      </ModalContent>
    </Modal>
  );
};

export default ModalControlledPreview;
