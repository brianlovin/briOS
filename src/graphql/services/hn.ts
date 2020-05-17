import fetch from 'isomorphic-unfetch'

const TOP_BASE_URL = 'https://hacker-news.firebaseio.com/v0'
const ITEM_BASE_URL = 'https://api.hnpwa.com/v0'

export async function getPostIds(sort) {
  const data = await fetch(`${TOP_BASE_URL}/${sort}stories.json`).then((res) =>
    res.json()
  )

  return data.slice(0, 16)
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
      time: null,
      comments: comment.comments.slice(0, 4).map(trimComments).filter(Boolean),
    })
  }

  const shortComments = data.comments
    .slice(0, 12)
    .map(trimComments)
    .filter(Boolean)

  const post = Object.assign(data, {
    ...data,
    time: null,
    comments: includeComments ? shortComments : null,
  })

  return post
}
