import { Button } from "@/foundations/ui/button/button";
import {
  Popover,
  PopoverContent,
  PopoverEmpty,
  PopoverSearchInput,
  PopoverTrigger,
} from "@/foundations/ui/popover/popover";

export default function PopoverEmptyPreview() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Empty State</Button>
      </PopoverTrigger>
      <PopoverContent className="p-0">
        <PopoverSearchInput placeholder="Search items..." />
        <PopoverEmpty>No items found.</PopoverEmpty>
      </PopoverContent>
    </Popover>
  );
}
