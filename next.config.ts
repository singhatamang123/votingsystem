// next.config.ts

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    // Allow local static images from the public folder (including filenames with spaces)
    unoptimized: true,
  },
};

export default nextConfig;