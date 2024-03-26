/** @type {import('next').NextConfig} */
const path = require('path');
const nextConfig = {
  output: 'standalone',
  webpack: (config, { _isServer }) => {
    // for path in tsconfig.js: "@/*": ["./src/*"]
    config.resolve.alias['@'] = path.join(__dirname, 'src');
    return config;
  },
};

module.exports = nextConfig;
