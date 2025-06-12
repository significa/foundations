import { Button } from "../../button/button";
import {
  Dialog,
  DialogActions,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "../dialog";

export default function DialogTallPreview() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Open Tall Dialog</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Very Tall Dialog</DialogTitle>
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
        <DialogActions>
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
}
