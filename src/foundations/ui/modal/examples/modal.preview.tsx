"use client";

import { Button } from "@/foundations/ui/button/button";
import {
  Modal,
  ModalClose,
  ModalContent,
  ModalDescription,
  ModalTitle,
  ModalTrigger,
} from "@/foundations/ui/modal/modal";

const ModalControlledPreview = () => {
  return (
    <Modal>
      <ModalTrigger asChild>
        <Button variant="outline">Open</Button>
      </ModalTrigger>
      <ModalContent className="min-w-xs space-y-6 rounded-xl p-4">
        <div className="space-y-1">
          <ModalTitle className="font-semibold">Title</ModalTitle>
          <ModalDescription>Description</ModalDescription>
        </div>
        <ModalClose asChild>
          <Button variant="outline">Close</Button>
        </ModalClose>
      </ModalContent>
    </Modal>
  );
};

export default ModalControlledPreview;
