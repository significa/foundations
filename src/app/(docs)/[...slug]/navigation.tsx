import Link from "next/link";

import { cn } from "@/lib/utils";
import { navigation } from "@/lib/navigation";

export const Navigation = ({ slug }: { slug: string[] }) => {
  const flatMenu = navigation.reduce<(typeof navigation)[number]["children"]>(
    (acc, item) => {
      return [...acc, ...item.children];
    },
    []
  );

  const currentIndex = flatMenu.findIndex(
    (item) => item.href === `/${slug.join("/")}`
  );

  const prev = currentIndex > 0 ? flatMenu[currentIndex - 1] : null;
  const next =
    currentIndex < flatMenu.length - 1 ? flatMenu[currentIndex + 1] : null;

  if (currentIndex < 0) return null;

  if (!prev && !next) return null;

  return (
    <div className="flex gap-4">
      {prev && (
        <NavigationCard href={prev.href} label="Previous" title={prev.title} />
      )}
      {next && (
        <NavigationCard
          className="text-right"
          href={next.href}
          label="Next"
          title={next.title}
        />
      )}
    </div>
  );
};

const NavigationCard = ({
  className,
  title,
  label,
  href,
}: {
  className?: string;
  title: string;
  label: string;
  href: string;
}) => {
  return (
    <Link
      className={cn(
        "p-4 rounded-lg border border-border flex-1 transition hover:bg-foreground/3 focus-visible:bg-foreground/3 outline-none",
        className
      )}
      href={href}
    >
      <p className="text-xs text-foreground-secondary mb-1">{label}</p>
      <p className="text-sm font-medium">{title}</p>
    </Link>
  );
};
