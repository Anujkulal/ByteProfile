import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    serverActions: {
      bodySizeLimit: "4mb"
    }
  },
  images: {
    domains: ['9crqdg7mwmvph862.public.blob.vercel-storage.com'],
  },
  eslint: {
    ignoreDuringBuilds: false,
    dirs: ['src', 'app'], // Only lint these directories
  },
  typescript: {
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
