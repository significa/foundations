const fs = require('fs');
const path = require('path');
const { writeMdxCodeFiles, SOURCE_DIRECTORIES } = require('./scripts/mdx-code-files.cjs');

const withNextra = require('nextra')({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.jsx'
});

module.exports = withNextra({
  output: 'export',
  images: {
    unoptimized: true
  },
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      config.watchOptions = { aggregateTimeout: 600, poll: 1000 };

      for (const sourceDirectory of SOURCE_DIRECTORIES) {
        const watchDirectory = path.resolve(__dirname, 'src', sourceDirectory);

        if (fs.existsSync(watchDirectory)) {
          fs.watch(watchDirectory, (eventType, filename) => {
            if (filename) {
              writeMdxCodeFiles();
            }
          });
        }
      }
    }

    return config;
  }
});

// If you have other Next.js configurations, you can pass them as the parameter:
// module.exports = withNextra({ /* other next.js config */ })
