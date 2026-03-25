import {
  ArrowSquareOutIcon,
  PackageIcon,
  PencilIcon,
  SunIcon,
} from '@phosphor-icons/react/dist/ssr';

import { Button, IconButton } from '@/foundations/ui/button/button';

export default function ButtonIconsPreview() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <IconButton variant="outline" aria-label="Switch theme">
        <SunIcon />
      </IconButton>
      <Button variant="outline">
        <PencilIcon />
        <span>Edit</span>
      </Button>
      <Button variant="outline">
        <PackageIcon />
        <span>External link</span>
        <ArrowSquareOutIcon />
      </Button>
    </div>
  );
}
