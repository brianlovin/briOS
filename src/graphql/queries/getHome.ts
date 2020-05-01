import { postFragment, episodeFragment, repoFragment } from '../fragments'

export const getHome = `
  {
    posts(first: 5) {
      ${postFragment}
    }
    episodes {
      ${episodeFragment}
    }
    repos {
      ${repoFragment}
    }
  }
`
