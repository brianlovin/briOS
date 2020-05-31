const path = require('path')
const withSourceMaps = require('@zeit/next-source-maps')()
// const withBundleAnalyzer = require('@next/bundle-analyzer')({
//   enabled: process.env.ANALYZE === 'true',
// })

module.exports = withSourceMaps({
  env: {
    FATHOM_SITE_ID: process.env.FATHOM_SITE_ID,
    FATHOM_CUSTOM_URL: process.env.FATHOM_CUSTOM_URL,
    GHOST_API_KEY: process.env.GHOST_API_KEY,
    SENTRY_DSN: process.env.SENTRY_DSN,
  },
  webpack: (config, { isServer }) => {
    config.resolve.alias['~'] = path.resolve('./src')

    if (!isServer) {
      config.resolve.alias['@sentry/node'] = '@sentry/browser'
    }

    return config
  },
})
