import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    formats: ['image/webp', 'image/avif'],
    qualities: [25, 50, 75, 100],
  },
  // Enable static file serving
  trailingSlash: false,
  // Optimize for Vercel
  output: 'standalone',
};

export default nextConfig;
