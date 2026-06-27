import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  turbopack: {
    resolveAlias: {
      // ponytail: markstream optional diagram peers; install real peers if D2/infographic posts are needed.
      "@antv/infographic": "./lib/markstream-empty-peer.ts",
      "@terrastruct/d2": "./lib/markstream-empty-peer.ts",
    },
  },
};

export default nextConfig;
