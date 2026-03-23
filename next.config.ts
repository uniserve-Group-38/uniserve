import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@prisma/client", "pg"],
  turbopack: {
    resolveAlias: {
      "@prisma/client": path.resolve(__dirname, "lib/generated/prisma"),
    },
  },images: {remotePatterns: [
    {
      protocol: "https",
    hostname: "**",
    },]
  },
  typescript:{
    ignoreBuildErrors:true
  },
};

export default nextConfig;
