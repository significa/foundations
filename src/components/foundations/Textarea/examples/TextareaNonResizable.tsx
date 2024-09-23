import { Textarea } from 'components/foundations/Textarea';

export function TextareaNonResizable() {
  return (
    <Textarea label="Tell us something short" placeholder="Type away" rows={4} resizable={false} />
  );
}
