import GhostContentAPI from '@tryghost/content-api'

export const ghost = new GhostContentAPI({
  url: 'https://paulowe.com',
  key: process.env.GHOST_API_KEY,
  version: 'v3',
})
