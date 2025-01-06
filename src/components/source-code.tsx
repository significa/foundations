import { promises as fs } from "fs";
import path from "path";

const fixImports = (code: string) => {
  return code.replace(/@\/foundations\/ui/g, "@/components");
};

export const SourceCode = async ({ path: p }: { path: string }) => {
  const code = await fs.readFile(
    path.join(process.cwd(), "src", ...p.split("/")),
    "utf-8"
  );

  return (
    <pre className="border border-border rounded-xl p-4 overflow-scroll">
      {fixImports(code)}
    </pre>
  );
};
