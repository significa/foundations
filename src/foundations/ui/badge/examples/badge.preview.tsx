import { PackageIcon } from "@phosphor-icons/react/dist/ssr";
import { Badge, BadgeIcon, BadgeStatus } from "@/foundations/ui/badge/badge";

export default function BadgePreview() {
  return (
    <Badge>
      <BadgeIcon>
        <PackageIcon />
      </BadgeIcon>
      <span>Up to date</span>
      <BadgeStatus className="bg-emerald-500" />
    </Badge>
  );
}
