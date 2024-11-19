import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      { hostname: "mlb24.theshow.com", pathname: "/**", protocol: "https" },
      { hostname: "cards.theshow.com", pathname: "/**", protocol: "https" },
    ],
  },
};

export default nextConfig;
