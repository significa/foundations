import * as pagefind from "pagefind";

const env = process.argv.slice(2).includes("--dev") ? "dev" : "prod";

const pagefindPath = env === "dev" ? ".next" : "out";
const pagefindOutPath = env === "dev" ? "public/pagefind" : "out/pagefind";

// Create a Pagefind search index to work with
const { index } = await pagefind.createIndex();

// Index all HTML files in a directory
await index.addDirectory({
  path: pagefindPath,
});

await index.writeFiles({
  outputPath: pagefindOutPath,
});

await pagefind.close();
