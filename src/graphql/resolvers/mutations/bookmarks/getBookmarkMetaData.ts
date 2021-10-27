import cheerio from 'cheerio'
import URL from 'url'

import { validUrl } from '~/lib/validators'

export default async function getBookmarkMetaData(url) {
  const res = await fetch(url)
  const html = await res.text()
  const $ = cheerio.load(html)

  const { host, protocol } = URL.parse(url)

  const TITLE_LIMIT = 280
  const IMAGE_LIMIT = 512
  const DESCRIPTION_LIMIT = 2048

  const getMetavalue = (name) =>
    $(`meta[name=${name}]`).attr('content') ||
    $(`meta[name="twitter:${name}"]`).attr('content') ||
    $(`meta[property=${name}]`).attr('content') ||
    $(`meta[property="twitter:${name}"]`).attr('content') ||
    null

  const favicon =
    $(`link[rel="apple-touch-icon"]`).attr('href') ||
    $(`link[rel="shortcut icon"]`).attr('href') ||
    $(`link[rel="icon"]`).attr('href')
  let faviconUrl = null
  if (favicon) {
    if (favicon.startsWith('data:')) {
      // if the favicon is a hard-coded URL, or points to some external asset
      // like a CDN, then just use that
      faviconUrl = null
    } else if (validUrl(favicon)) {
      // sometimes favicons are embedded svgs, usually prefixed with `data:`
      // we can ignore these, since we're not going to render svgs
      faviconUrl = favicon
    } else {
      // otherwise, we are dealing with a relative path and need to sanitize
      // replace .. because sometimes people use relative paths
      faviconUrl = favicon.replace('..', '')
      // ensure there is a leading /
      if (faviconUrl[0] !== '/') faviconUrl = `/${faviconUrl}`
      faviconUrl = `${protocol}//${host}${faviconUrl}`
    }
  }

  // it's possible that a url doesn't return a title
  let title = $('title').first().text()
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
    faviconUrl,
  }
}
