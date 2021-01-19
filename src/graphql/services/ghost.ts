import GhostContentAPI from '@tryghost/content-api'

export const ghost = new GhostContentAPI({
  url: 'https://paulsmessage.com',
  key: process.env.GHOST_API_KEY,
  version: 'v3',
})
