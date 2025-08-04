import { Button } from "@/foundations/ui/button/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/foundations/ui/popover/popover";

export default function PopoverCustomWidthPreview() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Custom Width</Button>
      </PopoverTrigger>
      <PopoverContent className="w-96">
        <p>This popover has a custom width of 24rem (w-96).</p>
        <p className="text-muted-foreground mt-2 text-sm">
          You can customize the width of the popover by adding a width utility
          class to the PopoverContent component.
        </p>
      </PopoverContent>
    </Popover>
  );
}
