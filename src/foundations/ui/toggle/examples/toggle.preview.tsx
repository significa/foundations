import { StarIcon } from "@phosphor-icons/react/dist/ssr";

import { Toggle } from "#/foundations/ui/toggle/toggle.tsx";

export default function TogglePreview() {
  return (
    <Toggle aria-label="Favorite" square>
      <StarIcon />
    </Toggle>
  );
}
