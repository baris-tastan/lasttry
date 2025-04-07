import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env:{
    DATABASE_URL:process.env.DATABASE_URL,
    AUTH_SECRET:process.env.AUTH_SECRET,
    GOOGLE_CLIENT_ID:process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET:process.env.GOOGLE_CLIENT_SECRET,
    GITHUB_CLIENT_ID:process.env.GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET:process.env.GITHUB_CLIENT_SECRET
  },
  
  
  serverExternalPackages: ["mongoose"],
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = [
        ...config.externals,
        "mongoose",
      ];
    }
    config.experiments = {
      topLevelAwait: true,
      layers: true,
    };
    return config;
  },
};

export default nextConfig;