import * as pagefind from 'pagefind';

const env = process.argv.slice(2).includes('--dev') ? 'dev' : 'prod';
const pagefindOutPath = env === 'dev' ? 'public/pagefind' : 'dist/pagefind';

console.log(`[pagefind] Environment: ${env}`);
console.log(`[pagefind] Output path: ${pagefindOutPath}`);

// Create a Pagefind search index to work with
console.log('[pagefind] Creating search index...');
const { index } = await pagefind.createIndex();
console.log('[pagefind] Search index created.');

// Index all HTML files in a directory
console.log('[pagefind] Indexing HTML files in dist/...');
await index.addDirectory({
  path: 'dist',
});
console.log('[pagefind] Indexing complete.');

console.log(`[pagefind] Writing files to ${pagefindOutPath}...`);
await index.writeFiles({
  outputPath: pagefindOutPath,
});
console.log('[pagefind] Files written successfully.');

await pagefind.close();
console.log('[pagefind] Done.');
