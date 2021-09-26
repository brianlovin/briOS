import cheerio from 'cheerio'
import URL from 'url'

export default async function getBookmarkMetaData(url) {
  const res = await fetch(url)
  const html = await res.text()
  const $ = cheerio.load(html)

  const { host } = URL.parse(url)

  const getMetavalue = (name) =>
    $(`meta[name=${name}]`).attr('content') ||
    $(`meta[name="twitter:${name}"]`).attr('content') ||
    $(`meta[property=${name}]`).attr('content') ||
    $(`meta[property="twitter:${name}"]`).attr('content') ||
    null

  return {
    url,
    host,
    title: $('title').first().text(),
    image: getMetavalue('image'),
    siteName: getMetavalue('site_name'),
    description: getMetavalue('description'),
    author: getMetavalue('author'),
    creator: getMetavalue('creator'),
  }
}
