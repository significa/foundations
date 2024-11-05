const path = require('path');
const fs = require('fs');

const TEMP_DIRECTORY = '.temp';
const EXTENSIONS = ['ts', 'tsx', 'jsx', 'js', 'mjs', 'cjs'];

function readFileWithoutExtensionSync(filepath) {
  for (let index = 0; index < EXTENSIONS.length; index++) {
    const extension = EXTENSIONS[index];
    const extFilepath = `${filepath}.${extension}`;

    if (fs.existsSync(extFilepath)) {
      return fs.readFileSync(extFilepath, 'utf8');
    }
  }

  return undefined;
}

class CustomResolverPlugin {
  constructor() {
    if (fs.existsSync(TEMP_DIRECTORY)) {
      fs.rmSync(TEMP_DIRECTORY, { recursive: true });
    }

    fs.mkdirSync(TEMP_DIRECTORY);
  }

  apply(resolver) {
    const target = resolver.ensureHook('resolve');

    resolver.getHook('resolve').tapAsync('CustomResolver', (request, resolveContext, callback) => {
      if (request.request.startsWith('@code')) {
        try {
          const filepath = request.request.replace('@code/', '');
          const filename = `${request.request.replace(/ |\\|\/|\./g, '')}.mdx`;
          const raw = readFileWithoutExtensionSync(path.resolve(__dirname, 'src', filepath));

          if (!raw) {
            throw new Error('File not found');
          }

          const tempFilepath = path.resolve(__dirname, TEMP_DIRECTORY, filename);

          fs.writeFileSync(tempFilepath, `\`\`\`tsx copy\n${raw}\n\`\`\`\n`, 'utf8');

          const customRequest = {
            ...request,
            request: tempFilepath
          };

          resolver.doResolve(target, customRequest, null, resolveContext, callback);
        } catch (e) {
          console.log(e);
          callback();
        }
      } else {
        callback();
      }
    });
  }
}

module.exports = CustomResolverPlugin;
