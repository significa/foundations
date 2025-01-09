import path from "path";
import { format } from "date-fns";

import { getLastModifiedDate } from "@/lib/last-updated";
import { Calendar } from "@phosphor-icons/react/dist/ssr";

export const LastUpdated = async ({ filePath }: { filePath: string }) => {
  const lastModified = await getLastModifiedDate(
    path.join(process.cwd(), filePath)
  );

  return (
    <p className="flex items-center gap-1 text-xs text-foreground-secondary">
      <Calendar />
      Edited {format(lastModified, "PPP")}
    </p>
  );
};
