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
  async redirects() {
    return [
      {
        source: '/uses',
        destination: '/stack',
        permanent: true,
      },
      {
        source: '/design-details',
        destination: '/app-dissection',
        permanent: true,
      },
      {
        source: '/design-details/:slug',
        destination: '/app-dissection/:slug',
        permanent: true,
      },
      {
        source: '/journal',
        destination: '/writing',
        permanent: true,
      },
      {
        source: '/overthought',
        destination: '/writing',
        permanent: true,
      },
      {
        source: '/overthought/:slug',
        destination: '/writing/:slug',
        permanent: true,
      },
    ]
  },
})
