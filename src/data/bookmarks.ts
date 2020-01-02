import fetch from 'isomorphic-unfetch'
const baseUrl = process.env.NODE_ENV === 'production'
  ? 'https://brianlovin.com'
  : 'http://localhost:3000'

export async function getBookmarks() {
  const data = await fetch(`${baseUrl}/api/bookmarks/get`)
  const bookmarks = await data.json()
  return bookmarks.data
}