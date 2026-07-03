import * as pagefind from "pagefind";

const env = process.argv.slice(2).includes("--dev") ? "dev" : "prod";
const pagefindOutPath = env === "dev" ? "public/pagefind" : "dist/pagefind";
const { index } = await pagefind.createIndex();
await index.addDirectory({
  path: "dist",
});
await index.writeFiles({
  outputPath: pagefindOutPath,
});

await pagefind.close();
