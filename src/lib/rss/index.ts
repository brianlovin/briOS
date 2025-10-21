import { Feed } from 'feed'

import routes from '~/config/routes'
import { baseEmail, baseUrl } from '~/config/seo'

export async function generateRSS(posts) {
  const date = new Date()
  const updated = new Date(posts[0].publishedAt)
  const author = {
    name: 'briOS',
    email: baseEmail,
    link: baseUrl,
  }

  const feed = new Feed({
    title: routes.writing.seo.title,
    description: routes.writing.seo.description,
    id: baseUrl,
    link: baseUrl,
    language: 'en',
    image: `${baseUrl}/static/meta/icon-512.png`,
    favicon: `${baseUrl}/static/favicon.ico`,
    copyright: `All rights reserved ${date.getFullYear()}, Brian Lovin`,
    updated,
    feedLinks: {
      rss2: `${baseUrl}/writing/rss`,
      json: `${baseUrl}/writing/feed`,
      atom: `${baseUrl}/writing/atom`,
    },
    author,
  })

  posts.forEach((post) => {
    const url = `${baseUrl}/writing/${post.slug}`
    feed.addItem({
      title: post.title,
      id: url,
      link: url,
      description: post.excerpt,
      author: [author],
      contributor: [author],
      date: new Date(post.publishedAt),
    })
  })

  const rss = feed.rss2()
  const atom = feed.atom1()
  const json = feed.json1()

  return {
    rss,
    atom,
    json,
  }
}
