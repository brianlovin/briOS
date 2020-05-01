import { bookmarkFragment } from '../fragments'

export const getBookmarks = `
  {
    bookmarks {
      ${bookmarkFragment}
    }
  }
`
