import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://127.0.0.1:5002/api/:path*",
      },
    ];
  },
};
export default nextConfig;
