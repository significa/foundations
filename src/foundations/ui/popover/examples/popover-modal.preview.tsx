import { Button } from "@/foundations/ui/button/button";
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from "@/foundations/ui/popover/popover";

export default function PopoverModalPreview() {
  return (
    <Popover modal>
      <PopoverTrigger asChild>
        <Button variant="outline">Open Modal Popover</Button>
      </PopoverTrigger>
      <PopoverContent className="flex flex-col gap-4">
        <h3 className="text-sm font-medium">This is a modal popover</h3>
        <p className="text-foreground-secondary text-sm">
          It will trap focus inside. Very useful for popovers with advanced
          interactions inside (like forms)
        </p>
        <div className="flex items-center gap-2">
          <PopoverClose asChild>
            <Button variant="outline" type="button">
              Cancel
            </Button>
          </PopoverClose>
          <Button type="submit">Submit</Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
