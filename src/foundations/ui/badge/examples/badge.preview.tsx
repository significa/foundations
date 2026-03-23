import { PackageIcon } from '@phosphor-icons/react/dist/ssr';

import { Badge } from '@/foundations/ui/badge/badge';

export default function BadgePreview() {
  return (
    <Badge>
      <Badge.Icon>
        <PackageIcon />
      </Badge.Icon>
      <span>Up to date</span>
      <Badge.Status className="bg-emerald-500" />
    </Badge>
  );
}
