import { X } from "@phosphor-icons/react/dist/ssr";

import { Button } from "../../button/button";
import { Dialog, DialogClose, DialogContent, DialogTrigger } from "../dialog";

export default function DialogArbitraryPreview() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Open Dialog</Button>
      </DialogTrigger>
      <DialogContent className="p-0">
        <DialogClose className="absolute top-3 right-3" asChild>
          <Button variant="outline" size="sm" square>
            <X className="size-4" />
          </Button>
        </DialogClose>
        <div className="flex flex-col items-center rounded-2xl p-6">
          <div className="border-border bg-background-secondary mb-4 size-24 rounded-full border" />
          <h2 className="text-xl font-semibold">John Doe</h2>
          <p className="text-foreground-secondary mb-4 text-sm">
            Software Engineer
          </p>
          <div className="mb-6 flex space-x-4">
            <div className="text-center">
              <p className="font-semibold">1.2k</p>
              <p className="text-foreground-secondary text-xs">Followers</p>
            </div>
            <div className="text-center">
              <p className="font-semibold">3.4k</p>
              <p className="text-foreground-secondary text-xs">Following</p>
            </div>
            <div className="text-center">
              <p className="font-semibold">567</p>
              <p className="text-foreground-secondary text-xs">Posts</p>
            </div>
          </div>
          <Button>Follow</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
