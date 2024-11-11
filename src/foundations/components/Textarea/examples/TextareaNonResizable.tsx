import { Textarea } from '@/foundations/components/Textarea';

export function TextareaNonResizable() {
  return (
    <Textarea label="Tell us something short" placeholder="Type away" rows={4} resizable={false} />
  );
}
