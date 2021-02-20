const path = require('path')
const withMDX = require('@next/mdx')({
  extension: /\.mdx?$/,
})

module.exports = withMDX({
  pageExtensions: ['ts', 'tsx', 'mdx'],
  images: {
    domains: ['pbs.twimg.com'],
  },
  env: {
    FATHOM_SITE_ID: process.env.FATHOM_SITE_ID,
    FATHOM_CUSTOM_URL: process.env.FATHOM_CUSTOM_URL,
    GHOST_API_KEY: process.env.GHOST_API_KEY,
    SIMPLECAST_V2_API_KEY: process.env.SIMPLECAST_V2_API_KEY,
  },
})
