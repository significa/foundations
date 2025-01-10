import { Badge } from "@/foundations/ui/badge/badge";
import { ArrowSquareOut } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";

interface DependenciesListProps {
  dependencies: {
    name: string;
    href: string;
  }[];
}

export const DependenciesList = ({ dependencies }: DependenciesListProps) => {
  return (
    <ul className="list-disc ml-6">
      {dependencies.map(({ name, href }) => {
        const type = href.startsWith("/") ? "internal" : "external";
        const Component = type === "internal" ? Link : "a";

        return (
          <li className="py-1" key={name}>
            <Component
              className="inline-flex items-center gap-2"
              href={href}
              target={type === "external" ? "_blank" : undefined}
            >
              <span className="underline">{name}</span>
              {type === "internal" ? (
                <Badge size="sm" variant="info">
                  Internal
                </Badge>
              ) : (
                <ArrowSquareOut className="text-foreground-secondary" />
              )}
            </Component>
          </li>
        );
      })}
    </ul>
  );
};
