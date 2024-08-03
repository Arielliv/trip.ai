/* v8 ignore start */
// @ts-check
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  compiler: {
    // Enables the styled-components SWC transform
    styledComponents: true,
  },
  transpilePackages: ['mui-file-input'],
  publicRuntimeConfig: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_GOOGLE_CLIENT_ID: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_GOOGLE_CLIENT_SECRET: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_OPENAI_API_KEY: process.env.NEXT_PUBLIC_API_URL,
  },
  webpack: (config) => {
    config.resolve.alias['@'] = path.resolve(__dirname, './');
    config.resolve.fallback = {
      'mongodb-client-encryption': false,
      aws4: false,
    };
    // Setup other custom Webpack configurations as needed
    return config;
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/locations',
        permanent: true,
      },
    ];
  },
  reactStrictMode: false, // to not rendered twice (production)
};

export default nextConfig;

/* v8 ignore stop */
