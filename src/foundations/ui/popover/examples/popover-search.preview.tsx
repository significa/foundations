import { Button } from "@/foundations/ui/button/button";
import {
  Popover,
  PopoverContent,
  PopoverSearchInput,
  PopoverTrigger,
} from "@/foundations/ui/popover/popover";

export default function PopoverSearchPreview() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Search</Button>
      </PopoverTrigger>
      <PopoverContent className="p-0">
        <PopoverSearchInput placeholder="Search items..." />
        <div className="mt-2 space-y-1 p-1">
          <div className="hover:bg-foreground/5 rounded-lg px-2 py-1.5">
            Item 1
          </div>
          <div className="hover:bg-foreground/5 rounded-lg px-2 py-1.5">
            Item 2
          </div>
          <div className="hover:bg-foreground/5 rounded-lg px-2 py-1.5">
            Item 3
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
