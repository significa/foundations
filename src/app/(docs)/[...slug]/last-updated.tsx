import path from "path";
import { format } from "date-fns";

import { getLastModifiedDate } from "@/lib/fs";
import { Calendar } from "@phosphor-icons/react/dist/ssr";

export const LastUpdated = async ({ filePath }: { filePath: string }) => {
  const lastModified = await getLastModifiedDate(
    path.join(process.cwd(), filePath)
  );

  return (
    <p className="text-foreground-secondary flex items-center gap-1 text-xs">
      <Calendar />
      Edited {format(lastModified, "PPP")}
    </p>
  );
};
