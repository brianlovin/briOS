import { postFragment } from '../fragments'

export const getPosts = `
  {
    posts {
      ${postFragment}
    }
  }
`
