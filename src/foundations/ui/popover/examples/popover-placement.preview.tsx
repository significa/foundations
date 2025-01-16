import { Button } from "@/foundations/ui/button/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/foundations/ui/popover/popover";

export default function PopoverPlacementPreview() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4">
      <Popover placement="top">
        <PopoverTrigger asChild>
          <Button variant="outline">Top</Button>
        </PopoverTrigger>
        <PopoverContent>
          <p>This popover appears on top.</p>
        </PopoverContent>
      </Popover>

      <Popover placement="bottom">
        <PopoverTrigger asChild>
          <Button variant="outline">Bottom</Button>
        </PopoverTrigger>
        <PopoverContent>
          <p>This popover appears at the bottom.</p>
        </PopoverContent>
      </Popover>

      <Popover placement="left">
        <PopoverTrigger asChild>
          <Button variant="outline">Left</Button>
        </PopoverTrigger>
        <PopoverContent>
          <p>This popover appears on the left.</p>
        </PopoverContent>
      </Popover>

      <Popover placement="right">
        <PopoverTrigger asChild>
          <Button variant="outline">Right</Button>
        </PopoverTrigger>
        <PopoverContent>
          <p>This popover appears on the right.</p>
        </PopoverContent>
      </Popover>
    </div>
  );
}
