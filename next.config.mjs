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
};

export default nextConfig;

/* v8 ignore stop */
