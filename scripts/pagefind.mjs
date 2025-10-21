import * as pagefind from "pagefind";

const pagefindPath = process.env.ENVIRONMENT === "dev" ? ".next" : "out";
const pagefindOutPath =
  process.env.ENVIRONMENT === "dev" ? "public/pagefind" : "out/pagefind";

console.log("Pagefind indexing directory: ", process.env.ENVIRONMENT);

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
