import * as pagefind from "pagefind";

const isProduction = process.env.NODE_ENV === "production";

console.log("isProduction: ", isProduction);

// Create a Pagefind search index to work with
const { index } = await pagefind.createIndex();

// Index all HTML files in a directory
await index.addDirectory({
  path: pagefindDir,
});

await index.writeFiles({
  outputPath: isProduction ? "out/pagefind" : "public/pagefind",
});

await pagefind.close();
