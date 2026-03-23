import { Textarea } from '@/foundations/ui/textarea/textarea';

export default function TextareaResizePreview() {
  return (
    <Textarea.Resize
      className="w-80"
      placeholder="Write your next novel here"
    />
  );
}
