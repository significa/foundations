import React from "react";
import Link from "next/link";
import { HouseIcon } from "@phosphor-icons/react/dist/ssr";

import { Button } from "@/foundations/ui/button/button";
import { Badge } from "@/foundations/ui/badge/badge";

function NotFoundPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-2.5 p-4 py-16 text-center">
      <Badge>404</Badge>
      <h1 className="mt-1 text-3xl font-bold">Page not found</h1>
      <p className="text-muted-foreground max-w-md text-base">
        Oops! We couldn&apos;t find this page. Maybe it was moved, deleted, or
        never existed.
      </p>
      <Button asChild className="mt-4" variant="outline">
        <Link href="/">
          <HouseIcon />
          Go back home
        </Link>
      </Button>
    </main>
  );
}

export default NotFoundPage;
