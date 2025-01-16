import { Textarea } from "../textarea";

export default function TextareaPreview() {
  return (
    <Textarea
      className="w-80"
      rows={5}
      placeholder="Write your next novel here"
    />
  );
}
