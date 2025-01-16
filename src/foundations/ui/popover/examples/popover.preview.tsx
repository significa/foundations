import { Button } from "@/foundations/ui/button/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/foundations/ui/popover/popover";

export default function PopoverPreview() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Open Popover</Button>
      </PopoverTrigger>
      <PopoverContent>
        <p>This is the content of the popover.</p>
      </PopoverContent>
    </Popover>
  );
}
