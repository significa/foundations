import { Badge, BadgeIcon } from "@/foundations/ui/badge/badge";
import {
  ArrowSquareOutIcon,
  PackageIcon,
} from "@phosphor-icons/react/dist/ssr";
import { Link } from "@tanstack/react-router";

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

        return (
          <Badge
            key={name}
            asChild
            variant={type === "external" ? "neutral" : "info"}
          >
            <DependencyLink type={type} href={href}>
              <BadgeIcon>
                <PackageIcon />
              </BadgeIcon>
              <span>{name}</span>
              {type === "external" && (
                <BadgeIcon>
                  <ArrowSquareOutIcon className="text-muted-foreground" />
                </BadgeIcon>
              )}
            </DependencyLink>
          </Badge>
        );
      })}
    </div>
  );
};

const DependencyLink = ({
  type,
  href,
  children,
}: {
  type: "internal" | "external";
  href: string;
  children: React.ReactNode;
}) => {
  if (type === "internal") {
    return <Link to={href}>{children}</Link>;
  }

  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
};
