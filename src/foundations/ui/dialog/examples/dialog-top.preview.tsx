"use client";

import { Button } from "../../button/button";
import {
  Dialog,
  DialogActions,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "../dialog";

export default function DialogTopPreview() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Open at the top</Button>
      </DialogTrigger>
      <DialogContent align="top">
        <DialogTitle>Unsaved changes</DialogTitle>
        <DialogDescription>
          Are you sure you want to leave this page?
        </DialogDescription>
        <DialogActions>
          <Button>Confirm</Button>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
}
