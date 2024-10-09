// next.config.mjs
/** @type {import('next').NextConfig} */
import nextI18nextConfig from "./next-i18next.config.js";
import { NextFederationPlugin } from '@module-federation/nextjs-mf';
const url = process.env.NEXT_PUBLIC_REMOTE_EDITOR_URL


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
        source: '/action/:path*',
        destination: '/api/proxy?path=/action/:path*',
      },
      {
        source: '/api/:path*',
        destination: '/api/proxy?path=/api/:path*',
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

        },
        
      })
    );
    return config;
  },
};

export default nextConfig;
