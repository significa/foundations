import { Textarea } from 'components/foundations/Textarea';

export function TextareaError() {
  return (
    <Textarea
      label="Tell us something"
      placeholder="Type away"
      defaultValue="I think I cracked one too many eggs"
      error
      rows="7"
      resizable="false"
    />
  );
}
