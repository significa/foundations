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
        <div className="p-1">Items would go here</div>
      </PopoverContent>
    </Popover>
  );
}
