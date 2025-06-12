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

export default function DialogPreview() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Open</Button>
      </DialogTrigger>
      <DialogContent className="w-80">
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
