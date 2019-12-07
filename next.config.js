const path = require('path');
const webpack = require('webpack');

module.exports = {
  target: 'serverless',
  webpack: config => {
    config.resolve.alias['~'] = path.resolve('./src');
    return config;
  }
}