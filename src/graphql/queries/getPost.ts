import { postFragment } from '../fragments'

export const getPost = `
  query getPost($slug: String!, $first: Int) {
    post(slug: $slug) {
      ${postFragment}
    }
    posts(first: $first) {
      ${postFragment}
    }
  }
`
