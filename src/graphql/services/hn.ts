const TOP_BASE_URL = 'https://hacker-news.firebaseio.com/v0'
const ITEM_BASE_URL = 'https://api.hnpwa.com/v0'

export async function getTopPostIds(sort) {
  return await fetch(`${TOP_BASE_URL}/${sort}stories.json`).then(
    async (res) => {
      return await res.json()
    }
  )
}

export async function getPostById(id) {
  return await fetch(`${ITEM_BASE_URL}/item/${id}.json`).then(async (res) => {
    return await res.json()
  })
}
