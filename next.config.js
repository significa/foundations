const fs = require('fs');
const path = require('path');
const { buildRegistry, SOURCE_DIRECTORIES } = require('./scripts/build-registry.cjs');

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
          fs.watch(watchDirectory, { recursive: true }, (eventType, filename) => {
            if (filename) {
              buildRegistry();
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
