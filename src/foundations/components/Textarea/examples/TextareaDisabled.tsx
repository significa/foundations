import { Textarea } from '@/foundations/components/Textarea';

export function TextareaDisabled() {
  return <Textarea value="Disabled" disabled rows={7} resizable={false} />;
}
