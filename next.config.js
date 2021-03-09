const path = require('path')
const withSourceMaps = require('@zeit/next-source-maps')()
// const withBundleAnalyzer = require('@next/bundle-analyzer')({
//   enabled: process.env.ANALYZE === 'true',
// })

module.exports = withSourceMaps({
  images: {
    domains: ['d2fl8krjhnb3wd.cloudfront.net', 'pbs.twimg.com'],
  },
  env: {
    FATHOM_SITE_ID: process.env.FATHOM_SITE_ID,
    FATHOM_CUSTOM_URL: process.env.FATHOM_CUSTOM_URL,
    GHOST_API_KEY: process.env.GHOST_API_KEY,
    SENTRY_DSN: process.env.SENTRY_DSN,
    SIMPLECAST_V2_API_KEY: process.env.SIMPLECAST_V2_API_KEY,
  },
  webpack: (config, { isServer }) => {
    config.resolve.alias['~'] = path.resolve('./src')

    if (!isServer) {
      config.resolve.alias['@sentry/node'] = '@sentry/browser'
    }

    return config
  },
})
