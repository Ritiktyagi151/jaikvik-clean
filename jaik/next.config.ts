import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Preserve existing base path if you use one; remove if not needed
  // basePath: "",
};

export default nextConfig;
