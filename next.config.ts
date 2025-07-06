import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Only allow local images - no remote patterns needed
    remotePatterns: [],
    formats: ['image/webp', 'image/avif'],
  },
  // Enable experimental features for better performance
  experimental: {
    optimizePackageImports: ['@heroicons/react'],
  },
};

export default nextConfig;
