import * as pagefind from "pagefind";

const pagefindDir = process.env.NEXT_PUBLIC_PAGEFIND_DIR || ".next";

console.log(`Pagefind indexing directory: `, pagefindDir);

// Create a Pagefind search index to work with
const { index } = await pagefind.createIndex();

// Index all HTML files in a directory
await index.addDirectory({
  path: pagefindDir,
});

await index.writeFiles({
  outputPath: pagefindDir === "out" ? "out/pagefind" : "public/pagefind",
});

await pagefind.close();
