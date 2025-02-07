import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: 'hybgkn1asiylekyw.public.blob.vercel-storage.com',
        pathname: '/**'
      }
    ]
  }
};

export default nextConfig;
