const path = require('path');
const webpack = require('webpack');

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