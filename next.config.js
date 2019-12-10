const path = require('path');

module.exports = {
  experimental: {
    granularChunks: true,
    modern: true
  },
  webpack: config => {
    config.resolve.alias['~'] = path.resolve('./src');
    return config;
  }
}