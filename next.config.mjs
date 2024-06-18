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
  // reactStrictMode: false // to not rendered twice
};

export default nextConfig;

/* v8 ignore stop */
