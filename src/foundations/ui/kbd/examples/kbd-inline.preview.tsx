import { Kbd } from '@/foundations/ui/kbd/kbd';

export default function KbdInlinePreview() {
  return (
    <p className="text-foreground-secondary text-sm">
      Press{' '}
      <Kbd.Group>
        <Kbd>⇧</Kbd>
        <Kbd>⌘</Kbd>
        <Kbd>P</Kbd>
      </Kbd.Group>{' '}
      to open the command palette, or <Kbd>Esc</Kbd> to close it.
    </p>
  );
}
