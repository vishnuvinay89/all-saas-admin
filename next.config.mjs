// next.config.mjs
/** @type {import('next').NextConfig} */
import nextI18nextConfig from "./next-i18next.config.js";
import { NextFederationPlugin } from '@module-federation/nextjs-mf';
const url = process.env.REMOTE_EDITOR_URL

const remotes = (isServer) => {
  const location = isServer ? 'ssr' : 'chunks';
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

  distDir: 'build',
  images: {
    unoptimized: true,
  },
  reactStrictMode: true,
  experimental: {
    esmExternals: false,
  },
  async rewrites() {
    return  [
      {
        source: '/action/:path*', // Match any route starting with /action/
        destination: '/api/proxy?path=/action/:path*', // Forward to the proxy API
      },
      {
        source: '/api/:path*', // Match any route starting with /api/
        destination: '/api/proxy?path=/api/:path*', // Forward to the proxy API
      }
    ];
  },
  webpack: (config, { isServer }) => {
    config.plugins.push(
      new NextFederationPlugin({
        name: 'admin',
        filename: 'static/chunks/remoteEntry.js',
        remotes: remotes(isServer),
        exposes: {
          // Add exposed modules here, e.g., './Component': './path/to/component'
        },
        
      })
    );
    return config;
  },
};

export default nextConfig;
