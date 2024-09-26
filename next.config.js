const fs = require('fs');
const path = require('path');
const { buildRegistry } = require('./scripts/build-registry.cjs');

const REGISTRY_WATCH_DIRECTORIES = ['src/components/foundations', 'src/hooks/foundations'];

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

      for (const dir of REGISTRY_WATCH_DIRECTORIES) {
        const watchDirectory = path.resolve(__dirname, dir);

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
