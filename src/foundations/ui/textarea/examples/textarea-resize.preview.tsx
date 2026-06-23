import { Textarea } from "@/foundations/ui/textarea/textarea";

export default function TextareaResizePreview() {
  return (
    <Textarea
      className="field-sizing-content max-h-48 w-80 overflow-auto"
      placeholder="Write your next novel here"
    />
  );
}
