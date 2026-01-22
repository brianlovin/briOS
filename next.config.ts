import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@sparticuz/chromium"],
  async redirects() {
    return [
      {
        source: "/writing/:path(rss|RSS|Rss|feed|Feed)",
        destination: "/writing/rss.xml",
        permanent: true,
      },
      {
        source: "/til/:path(rss|RSS|Rss|feed|Feed)",
        destination: "/til/rss.xml",
        permanent: true,
      },
      {
        source: "/sites/:path(rss|RSS|Rss|feed|Feed)",
        destination: "/sites/rss.xml",
        permanent: true,
      },
      {
        source: "/ama/:path(rss|RSS|Rss|feed|Feed)",
        destination: "/ama/rss.xml",
        permanent: true,
      },
      {
        source: "/app-dissection/:path(rss|RSS|Rss|feed|Feed)",
        destination: "/app-dissection/rss.xml",
        permanent: true,
      },
      {
        source: "/stack/:path(rss|RSS|Rss|feed|Feed)",
        destination: "/stack/rss.xml",
        permanent: true,
      },
    ];
  },
  devIndicators: false,
  turbopack: {
    root: path.resolve(__dirname),
  },
  images: {
    qualities: [100, 75],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "imagedelivery.net",
      },
      {
        protocol: "https",
        hostname: "i.scdn.co",
      },
      // Notion CDN domains for uploaded files
      {
        protocol: "https",
        hostname: "prod-files-secure.s3.us-west-2.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "s3.us-west-2.amazonaws.com",
      },
      // R2 public bucket for optimized images
      {
        protocol: "https",
        hostname: "pub-69346df8bffc4907bbde2b554f176e29.r2.dev",
      },
    ],
  },
};

export default nextConfig;
