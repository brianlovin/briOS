const path = require('path')

module.exports = {
  env: {
    FATHOM_SITE_ID: process.env.FATHOM_SITE_ID,
    FATHOM_CUSTOM_URL: process.env.FATHOM_CUSTOM_URL,
    GHOST_API_KEY: process.env.GHOST_API_KEY,
  },
  webpack: (config) => {
    config.resolve.alias['~'] = path.resolve('./src')
    return config
  },
}
