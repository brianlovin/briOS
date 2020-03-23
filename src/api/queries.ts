import {
  postFragment,
  episodeFragment,
  bookmarkFragment
} from './fragments'

export const POST = `
  query getPost($slug: String!, $first: Int) {
    post(slug: $slug) {
      ${postFragment}
    }
    posts(first: $first) {
      ${postFragment}
    }
  }
`

export const POSTS = `
  {
    posts {
      ${postFragment}
    }
  }
`

export const EPISODES = `
  {
    episodes {
      ${episodeFragment}
    }
  }
`

export const BOOKMARKS = `
  {
    bookmarks {
      ${bookmarkFragment}
    }
  }
`

export const HOME = `
  {
    posts(first: 5) {
      ${postFragment}
    }
    episodes {
      ${episodeFragment}
    }
  }
`