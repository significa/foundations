const fs = require('fs');
const path = require('path');

const ROOT_DIRECTORY = 'src/';
const TARGET_DIRECTORY = '.registry';
const SOURCE_DIRECTORIES = ['components/foundations'];

function toPascalCase(str) {
  return str
    .replace(/(?:^|\s|-|_|\.)[a-zA-Z]/g, (match) => match.toUpperCase()) // capitalize first letter after space, dash, underscore, or dot
    .replace(/(?:\s|-|_|\.)/g, '') // remove spaces, dashes, underscores, and dots
    .replace(/[^a-zA-Z]/g, ''); // remove numbers and special characters
}

async function buildRegistry() {
  try {
    const startTime = performance.now();
    console.log('Building registry...');

    // validate source directories
    const fullSourceDirectories = SOURCE_DIRECTORIES.map((dir) =>
      path.join(ROOT_DIRECTORY, dir)
    ).filter((dir) => {
      const exists = fs.existsSync(dir);

      if (!exists) {
        console.warn(`└ Skipping invalid source directory: '${dir}'`);
      }

      return exists;
    });

    // clear target directory
    if (fs.existsSync(TARGET_DIRECTORY)) {
      fs.rmSync(TARGET_DIRECTORY, { recursive: true });
    }

    // create target directory
    fs.mkdirSync(TARGET_DIRECTORY);

    // read all files (at any depth) inside the source directories
    const files = fullSourceDirectories
      .flatMap((dir) => fs.readdirSync(dir, { recursive: true, withFileTypes: true }))
      .filter((dirent) => dirent.isFile());

    // prepare index file
    const index = {
      filename: 'index.tsx',
      imports: [],
      entries: []
    };

    for (const file of files) {
      let extension = path.extname(file.name);
      const basename = path.basename(file.name, extension);
      const fullPath = path.join(file.parentPath, file.name);

      extension = extension.replace(/^\.+/, ''); // remove leading dot;
      const isComponent = extension === 'tsx';

      // skip index files
      if (basename === 'index') {
        continue;
      }

      let rawFileContent = fs.readFileSync(fullPath, 'utf8');
      rawFileContent = rawFileContent.replace(/\n$/, ''); // remove trailing line break

      const mdxContentString = `\`\`\`${extension} copy\n${rawFileContent}\n\`\`\`\n`;

      const mdxBasename = `${toPascalCase(basename)}Code`;
      const mdxFilename = `${mdxBasename}.mdx`;
      const mdxPath = path.join(TARGET_DIRECTORY, mdxFilename);

      // write mdx code file
      fs.writeFileSync(mdxPath, mdxContentString, 'utf8');

      // generate entry key based on import path
      let key = path.relative(ROOT_DIRECTORY, file.parentPath);
      // append basename only when path basename !== component basename
      // this way we avoid having keys like 'components/Sample/Sample'
      if (path.basename(key) !== basename) {
        key = path.join(key, basename);
      }

      index.entries.push({ key, code: mdxBasename, component: isComponent ? basename : null });
      index.imports.push({ module: mdxBasename, named: false, path: `./${mdxFilename}` });

      if (isComponent) {
        index.imports.push({
          module: basename,
          named: true,
          path: `../${file.parentPath}/${basename}`
        });
      }
    }

    const formattedImports = index.imports
      .map(({ module, path, named }) => {
        return `import ${named ? `{ ${module} }` : module} from '${path}';`;
      })
      .join('\n');

    const formattedEntries = index.entries
      .map(({ key, code, component }) => {
        return `  '${key}': {\n    code: ${code},\n    component: ${component}\n  }`;
      })
      .join(',\n');

    const formattedEntryTypes = index.entries.map(({ key }) => `  | '${key}'`).join('\n');

    const indexContentString = [
      `// @ts-nocheck`,
      `// This file is autogenerated by scripts/mdx-code-files.ts`,
      `// Do not edit this file directly.`,
      formattedImports,
      ``,
      `export const INDEX = {`,
      formattedEntries,
      `};`,
      ``,
      `export type RegistryEntry =`,
      `${formattedEntryTypes};`,
      ``
    ].join('\n');

    // write index.tsx
    fs.writeFileSync(path.join(TARGET_DIRECTORY, index.filename), indexContentString, 'utf8');

    const duration = performance.now() - startTime;
    console.log(`└ Wrote (${files.length + 1} files in ${duration.toFixed(3)}ms)`);
  } catch (err) {
    console.error(err);
  }
}

const args = process.argv.slice(2);
if (args.indexOf('--run') !== -1) {
  buildRegistry();
}

module.exports = {
  SOURCE_DIRECTORIES,
  buildRegistry
};
