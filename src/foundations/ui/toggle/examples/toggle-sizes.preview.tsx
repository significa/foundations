import { StarIcon } from '@phosphor-icons/react/dist/ssr';

import { Toggle } from '@/foundations/ui/toggle/toggle';

export default function ToggleSizesPreview() {
  return (
    <div className="flex items-center gap-3">
      <Toggle aria-label="xs" size="xs" defaultPressed square>
        <StarIcon />
      </Toggle>
      <Toggle aria-label="sm" size="sm" defaultPressed square>
        <StarIcon />
      </Toggle>
      <Toggle aria-label="md" size="md" defaultPressed square>
        <StarIcon />
      </Toggle>
      <Toggle aria-label="lg" size="lg" defaultPressed square>
        <StarIcon />
      </Toggle>
    </div>
  );
}
