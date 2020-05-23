import fetch from 'isomorphic-unfetch'

const TOP_BASE_URL = 'https://hacker-news.firebaseio.com/v0'
const ITEM_BASE_URL = 'https://api.hnpwa.com/v0'

export async function getPostIds(sort) {
  const data = await fetch(`${TOP_BASE_URL}/${sort}stories.json`).then((res) =>
    res.json()
  )

  return data
}

export async function getPostById(id, includeComments = false) {
  const data = await fetch(`${ITEM_BASE_URL}/item/${id}.json`).then((res) => {
    return res.json()
  })

  function trimComments(comment) {
    if (!comment) return null

    if (comment.level > 3) return null

    return Object.assign(comment, {
      ...comment,
      comments: comment.comments.slice(0, 4).map(trimComments).filter(Boolean),
    })
  }

  const shortComments = data.comments
    .slice(0, 12)
    .map(trimComments)
    .filter(Boolean)

  const cleanUrl = data.domain
    ? `${data.url}?ref=brianlovin.com`
    : `https://brianlovin.com/hn/${data.id}`

  const post = Object.assign(data, {
    ...data,
    url: cleanUrl,
    comments: includeComments ? shortComments : null,
  })

  return post
}

export async function getHNPosts(sort) {
  const topPostIds = await getPostIds(sort)
  const postPromises = topPostIds
    .slice(0, 16)
    .map(async (id) => await getPostById(id, false))

  return await Promise.all([...postPromises])
}

export async function getHNPostsForDigest(sort) {
  const topPostIds = await getPostIds(sort)
  // topPostIds returns 500 by default. this can block the API route from
  // responding for a long time while each one is fetched individually.
  // it's much more likely that the most recent 200 (by decrementing id) are
  // the top posts within the last 24 hours
  const filtered = topPostIds.sort((a, b) => b - a).slice(0, 200)
  const postPromises = filtered.map(async (id) => await getPostById(id, false))
  const posts = await Promise.all([...postPromises])
  const now = new Date().getTime() / 1000
  const dayAgo = now - 60 * 60 * 24

  // don't return jobs or polls
  const links = posts.filter((post) => post.type === 'link')
  const withinLastDay = links.filter((post) => post.time > dayAgo)
  const sorted = withinLastDay.sort((a, b) => b.points - a.points)
  return sorted.slice(0, 16)
}
