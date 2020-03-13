const path = require('path');

module.exports = {
  experimental: {
    granularChunks: true,
    modern: true
  },
  env: {
    FATHOM_SITE_ID: process.env.FATHOM_SITE_ID,
    GHOST_API_KEY: process.env.GHOST_API_KEY
  },
  webpack: config => {
    config.resolve.alias['~'] = path.resolve('./src');
    return config;
  }
}