import fs from "fs";
import path from "path";

const srcDir = path.join(process.cwd(), "src");
const importsFile = path.join(
  process.cwd(),
  "src/app/preview/[slug]/imports.ts"
);

function main() {
  const components: Record<string, string> = {}; // Dictionary to hold component paths

  // Recursively read through the src directory
  function readDir(dir: string) {
    fs.readdirSync(dir).forEach((file) => {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        readDir(fullPath);
      } else if (file.endsWith(".preview.tsx")) {
        const slug = path.basename(file, ".preview.tsx");

        // Check if component name is already used
        if (components[slug]) {
          throw new Error(
            `Preview component name "${slug}" is already used. Each preview component must have a unique name.`
          );
        }

        const importPath = fullPath
          .replace(process.cwd(), "")
          .replace("/src/", "@/")
          .replace(".tsx", "");

        components[slug] = `dynamic(
    () => import("${importPath}")
  )`;
      }
    });
  }

  readDir(srcDir);

  // Generate the imports.ts content
  const importsContent = `// DO NOT EDIT. This file is automatically generated by the generate-imports script.
  
import dynamic from "next/dynamic";
import { ComponentType } from "react";

export const imports: Record<string, ComponentType> = {
  ${Object.entries(components)
    .map(([key, value]) => `['${key}']: ${value}`)
    .join(",\n  ")}
};
`;

  // Write to imports.ts
  fs.writeFileSync(importsFile, importsContent);
  console.log("imports.ts has been generated.");
}

const shouldWatch = process.argv.includes("--watch");

if (shouldWatch) {
  fs.watch(srcDir, { recursive: true }, (eventType, filename) => {
    if (filename && filename.endsWith(".preview.tsx")) {
      console.log(`Preview file changed: ${filename}`);
      main();
    }
  });
}

// Initial generation
main();
