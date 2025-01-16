import { Textarea } from "../textarea";

export default function TextareaMinimalPreview() {
  return (
    <Textarea
      className="w-80"
      variant="minimal"
      rows={5}
      placeholder="Write your next novel here"
    />
  );
}
