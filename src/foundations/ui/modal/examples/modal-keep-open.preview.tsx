import { useState } from "react";

import { Button } from "#/foundations/ui/button/button.tsx";
import { Modal } from "#/foundations/ui/modal/modal.tsx";
import { Textarea } from "#/foundations/ui/textarea/textarea.tsx";

const ModalKeepOpenPreview = () => {
  const [note, setNote] = useState("");
  const isDirty = note.length > 0;

  return (
    <Modal keepOpen={isDirty}>
      <Modal.Trigger asChild>
        <Button variant="outline">Add note</Button>
      </Modal.Trigger>
      <Modal.Content className="w-80 space-y-4 rounded-xl p-4">
        <div className="space-y-1">
          <Modal.Title className="font-semibold">Add note</Modal.Title>
          <Modal.Description>
            Once you type, Esc and the backdrop no longer close this.
          </Modal.Description>
        </div>
        <Textarea
          aria-label="Note"
          value={note}
          onChange={(event) => setNote(event.target.value)}
        />
        <div className="flex gap-2">
          <Modal.Close asChild onClick={() => setNote("")}>
            <Button>Save</Button>
          </Modal.Close>
          <Modal.Close asChild onClick={() => setNote("")}>
            <Button variant="outline">Discard</Button>
          </Modal.Close>
        </div>
      </Modal.Content>
    </Modal>
  );
};

export default ModalKeepOpenPreview;
