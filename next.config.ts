import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "mrfbasech.sitecoresandbox.cloud",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "edge.sitecorecloud.io",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
