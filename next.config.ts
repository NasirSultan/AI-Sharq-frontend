import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "3000",
        pathname: "/files/**",
      },
      {
        protocol: "https",
        hostname: "example.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "al-sharq.fra1.digitaloceanspaces.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
