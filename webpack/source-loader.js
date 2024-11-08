const path = require('path');

function sourceLoader(source) {
  const filename = path.basename(this.resourcePath);
  const extension = path.extname(filename).replace(/^\./, '');

  const json = JSON.stringify(source)
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');

  return `export default ${json}; export const extension = '${extension}'`;
}

module.exports = sourceLoader;
