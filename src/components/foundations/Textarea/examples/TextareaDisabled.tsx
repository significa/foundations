import { Textarea } from 'components/foundations/Textarea';

export function TextareaDisabled() {
  return <Textarea value="Disabled" disabled rows={7} resizable={false} />;
}
