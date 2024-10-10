// next.config.mjs
/** @type {import('next').NextConfig} */
import nextI18nextConfig from "./next-i18next.config.js";
import { NextFederationPlugin } from "@module-federation/nextjs-mf";
const url = process.env.WORKSPACE_BASE_URL;
// const url = "http://localhost:3000";

const remotes = (isServer) => {
  const location = isServer ? "ssr" : "chunks";
  return {
    editor: `editor@${url}/_next/static/${location}/remoteEntry.js`,
  };
};

const nextConfig = {
  eslint: {
    // Disabling on production builds because we're running checks on PRs via GitHub Actions.
    ignoreDuringBuilds: true,
  },
  trailingSlash: false,
  reactStrictMode: true,
  i18n: nextI18nextConfig.i18n,

  distDir: "build",
  images: {
    unoptimized: true,
  },
  reactStrictMode: true,
  experimental: {
    esmExternals: false,
  },
  async rewrites() {
    return [
      {
        source: "/action/asset/v1/upload/:identifier*", // Match asset upload routes
        destination: `${process.env.WORKSPACE_BASE_URL}/api/fileUpload`, // Forward asset uploads to fileUpload.js
      },
      {
        source: "/action/asset/:path*", // Match other /action/asset routes
        destination: `${process.env.WORKSPACE_BASE_URL}/api/proxy?path=/action/asset/:path*`, // Forward other /action/asset requests to proxy.js
      },
      {
        source: "/action/:path*", // Match any other routes starting with /action/
        destination: `${process.env.WORKSPACE_BASE_URL}/api/proxy?path=/action/:path*`, // Forward them to proxy.js
      },
      {
        source: "/api/:path*", // Match /api/ routes
        destination: `${process.env.WORKSPACE_BASE_URL}/api/proxy?path=/api/:path*`, // Forward them to proxy.js
      },
      {
        source: "/assets/public/:path*", // Match any URL starting with /assets/public/
        destination: `${process.env.CLOUD_STORAGE_URL}/:path*`, // Forward to S3, stripping "/assets/public"
      },
    ];
  },
  webpack: (config, { isServer }) => {
    config.plugins.push(
      new NextFederationPlugin({
        name: "admin",
        filename: "static/chunks/remoteEntry.js",
        remotes: remotes(isServer),
        exposes: {},
      })
    );
    return config;
  },
};

export default nextConfig;
