import { Package } from "@phosphor-icons/react/dist/ssr";
import { Badge, BadgeIcon, BadgeStatus } from "../badge";

export default function BadgePreview() {
  return (
    <Badge>
      <BadgeIcon>
        <Package />
      </BadgeIcon>
      <span>Up to date</span>
      <BadgeStatus className="bg-emerald-500" />
    </Badge>
  );
}
