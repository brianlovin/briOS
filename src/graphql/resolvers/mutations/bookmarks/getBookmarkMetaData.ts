import cheerio from 'cheerio'
import URL from 'url'

export default async function getBookmarkMetaData(url) {
  const res = await fetch(url)
  const html = await res.text()
  const $ = cheerio.load(html)

  const { host } = URL.parse(url)

  const TITLE_LIMIT = 280
  const IMAGE_LIMIT = 512
  const DESCRIPTION_LIMIT = 2048

  const getMetavalue = (name) =>
    $(`meta[name=${name}]`).attr('content') ||
    $(`meta[name="twitter:${name}"]`).attr('content') ||
    $(`meta[property=${name}]`).attr('content') ||
    $(`meta[property="twitter:${name}"]`).attr('content') ||
    null

  const title = $('title').first().text().substr(0, TITLE_LIMIT)
  const image =
    getMetavalue('image')?.length > IMAGE_LIMIT ? null : getMetavalue('image')
  const description = getMetavalue('description').substr(0, DESCRIPTION_LIMIT)
  const author = getMetavalue('author')
  const creator = getMetavalue('creator')

  return {
    url,
    host,
    title,
    image,
    description,
    author,
    creator,
  }
}
