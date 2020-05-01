import { episodeFragment } from '../fragments'

export const getEpisodes = `
  {
    episodes {
      ${episodeFragment}
    }
  }
`
