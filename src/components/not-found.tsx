import { Badge } from "@/foundations/ui/badge/badge";
import { Button } from "@/foundations/ui/button/button";
import { HouseIcon } from "@phosphor-icons/react";
import { Link } from "@tanstack/react-router";

export const NotFound = () => {
  return (
    <div className="flex h-full min-h-[80vh] w-full flex-col items-center justify-center gap-2.5 p-4 py-16 text-center">
      <Badge>404</Badge>
      <h1 className="mt-1 text-3xl font-bold">Page not found</h1>
      <p className="text-muted-foreground max-w-md text-base">
        Oops! We couldn&apos;t find this page. Maybe it was moved, deleted, or
        never existed.
      </p>
      <Button asChild className="mt-4" variant="outline">
        <Link to="/">
          <HouseIcon />
          Go back home
        </Link>
      </Button>
    </div>
  );
};
