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
    <div className="flex flex-col gap-4 sm:flex-row">
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
        "border-border hover:bg-foreground/3 focus-visible:bg-foreground/3 flex-1 rounded-lg border p-4 transition outline-none",
        className
      )}
      href={href}
    >
      <p className="text-muted-foreground mb-1 text-xs">{label}</p>
      <p className="text-sm font-medium">{title}</p>
    </Link>
  );
};
