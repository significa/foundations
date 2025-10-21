import * as pagefind from "pagefind";

const env = process.env.ENVIRONMENT ?? "prod";

const pagefindPath = env === "dev" ? ".next" : "out";
const pagefindOutPath = env === "dev" ? "public/pagefind" : "out/pagefind";

console.log("Pagefind indexing directory: ", env);

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
