import path from 'node:path';
import * as url from 'node:url';

import type { NextConfig } from 'next';
import withBundleAnalyzer from '@next/bundle-analyzer';
import { BRAND_GUIDELINE_LINK } from '@idriss-xyz/constants';
import { config } from 'dotenv-safe';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

const loadEnvironmentConfig = () => {
  // Skip dotenv-safe in CI environment
  if (process.env.CI) {
    return;
  }

  const environment = process.env.ENVIRONMENT || 'production';
  const environmentFile = {
    production: '.env.production',
    development: '.env.development',
  };

  try {
    config({
      path: path.resolve(__dirname, environmentFile[environment]),
      allowEmptyValues: true,
      example: path.resolve(__dirname, '.env.example'),
    });
  } catch (error) {
    console.warn('Error loading environment config:', error);
  }
};

loadEnvironmentConfig();

const LEGACY_URLS = [
  '/partner-whitelist',
  '/pricing',
  '/token-price',
  '/v1/getTwitterIDPlugin',
  '/v2/getTwitterIDPlugin',
  '/v2/getTwitterNamesPlugin',
  '/v1/getTwitterID',
  '/v1/getTwitterNames',
];

const nextConfig: NextConfig = {
  generateBuildId: () =>
    process.env.RAILWAY_GIT_COMMIT_SHA || `build-${Date.now()}`,

  productionBrowserSourceMaps: true,
  // eslint-disable-next-line @typescript-eslint/require-await
  async headers() {
    return [
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
        ],
      },
    ];
  },
  // eslint-disable-next-line @typescript-eslint/require-await
  async redirects() {
    return [
      {
        source: '/streamers',
        destination: '/creators',
        permanent: true,
      },
      {
        source: '/streamers/donate',
        destination: '/creators/donate',
        permanent: true,
      },
      {
        source: '/token',
        destination: '/#token',
        permanent: true,
      },
      {
        source: '/buy',
        destination: '/#token',
        permanent: true,
      },
      {
        source: '/prediction-markets',
        destination: '/#prediction-markets',
        permanent: true,
      },
      {
        source: '/docs',
        destination: 'https://docs.idriss.xyz/',
        basePath: false,
        permanent: false,
      },
      {
        source: '/brand',
        destination: BRAND_GUIDELINE_LINK,
        basePath: false,
        permanent: false,
      },
      {
        source: '/discord',
        destination: 'https://www.discord.gg/RJhJKamjw5',
        basePath: false,
        permanent: false,
      },
      {
        source: '/github',
        destination: 'https://www.github.com/idriss-xyz',
        basePath: false,
        permanent: false,
      },
      {
        source: '/extension',
        destination:
          'https://chromewebstore.google.com/detail/idriss/fghhpjoffbgecjikiipbkpdakfmkbmig',
        basePath: false,
        permanent: false,
      },
      {
        source: '/metamask',
        destination: 'https://snaps.metamask.io/snap/npm/idriss-crypto/snap/',
        basePath: false,
        permanent: false,
      },
      {
        source: '/pp',
        destination: 'https://docs.idriss.xyz/resources/privacy-policy',
        basePath: false,
        permanent: false,
      },
      {
        source: '/tos',
        destination: 'https://docs.idriss.xyz/resources/terms-of-service',
        basePath: false,
        permanent: false,
      },
      {
        source: '/service-status',
        destination: 'https://api.idriss.xyz/service-status',
        basePath: false,
        permanent: false,
      },
      {
        source: '/tokenomics',
        destination: 'https://docs.idriss.xyz/idriss-token',
        basePath: false,
        permanent: false,
      },
      {
        source: '/sale-faq',
        destination: 'https://docs.idriss.xyz/idriss-token/token-sale#faq',
        basePath: false,
        permanent: false,
      },
      ...LEGACY_URLS.map((url) => {
        return {
          source: url,
          destination: `https://legacy.idriss.xyz${url}`,
          permanent: false,
        };
      }),
    ];
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.mp3$/,
      type: 'asset/resource',
    });

    return config;
  },
  experimental: {
    optimizePackageImports: ['@idriss-xyz/ui'],
  },
  images: {
    domains: ['localhost'],
  },
  env: {
    DEV_LOGIN_PASSWORD: process.env.DEV_LOGIN_PASSWORD || '',
    RAILWAY_PUBLIC_DOMAIN: process.env.RAILWAY_PUBLIC_DOMAIN || '',
  },
};

// eslint-disable-next-line import/no-default-export
export default withBundleAnalyzer({ enabled: false })(nextConfig);
