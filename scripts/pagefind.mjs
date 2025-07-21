import * as pagefind from "pagefind";

// Create a Pagefind search index to work with
const { index } = await pagefind.createIndex();

// Index all HTML files in a directory
await index.addDirectory({
  path: ".next",
});

// Or, write the index to disk
await index.writeFiles({
  outputPath: "public/pagefind",
});

await pagefind.close();
