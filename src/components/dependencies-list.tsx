import { Badge, BadgeIcon } from "@/foundations/ui/badge/badge";
import {
  ArrowSquareOutIcon,
  PackageIcon,
} from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";

interface DependenciesListProps {
  dependencies: {
    name: string;
    href: string;
  }[];
}

export const DependenciesList = ({ dependencies }: DependenciesListProps) => {
  return (
    <div className="flex flex-wrap gap-2">
      {dependencies.map(({ name, href }) => {
        const type = href.startsWith("/") ? "internal" : "external";
        const Component = type === "internal" ? Link : "a";

        return (
          <Badge
            key={name}
            asChild
            variant={type === "external" ? "neutral" : "info"}
          >
            <Component
              href={href}
              target={type === "external" ? "_blank" : undefined}
            >
              <BadgeIcon>
                <PackageIcon />
              </BadgeIcon>
              <span>{name}</span>
              {type === "external" && (
                <BadgeIcon>
                  <ArrowSquareOutIcon className="text-muted-foreground" />
                </BadgeIcon>
              )}
            </Component>
          </Badge>
        );
      })}
    </div>
  );
};
