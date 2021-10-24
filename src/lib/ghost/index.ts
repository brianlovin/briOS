import GhostContentAPI from '@tryghost/content-api'

export const ghost = new GhostContentAPI({
  url: 'https://overthought.ghost.io',
  key: process.env.GHOST_API_KEY,
  version: 'v3',
})
