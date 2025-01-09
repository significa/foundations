import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    NEXT_TELEMETRY_DISABLED: "1",
  },
};

export default nextConfig;
