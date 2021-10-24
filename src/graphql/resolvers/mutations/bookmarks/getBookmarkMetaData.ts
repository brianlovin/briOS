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

  let title = $('title').first().text()
  console.log({ title })
  // it's possible that a url doesn't return a title
  title = title ? title.substr(0, TITLE_LIMIT) : title

  // it's possible that a url doesn't return a description
  let description = getMetavalue('description')
  description = description
    ? description.substr(0, DESCRIPTION_LIMIT)
    : description

  let image = getMetavalue('image')
  image = image ? (image.length > IMAGE_LIMIT ? null : image) : image

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
