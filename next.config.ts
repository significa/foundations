import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  env: {
    NEXT_TELEMETRY_DISABLED: "1",
  },
};

export default nextConfig;
