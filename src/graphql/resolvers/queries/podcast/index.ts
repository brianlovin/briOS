import fetch from 'isomorphic-unfetch'

const API_URL_ROOT = 'https://api.simplecast.com'
const API_KEY = process.env.SIMPLECAST_V2_API_KEY
const SHOW_ID = '56e415f0-1911-44b3-9b1c-99551f7146c3'

function transformEpisodeData(rawEpisode) {
  return {
    description: rawEpisode.description,
    id: rawEpisode.id,
    legacy_id: rawEpisode.legacy_id || null,
    long_description: rawEpisode.long_description || null,
    published_at: rawEpisode.published_at,
    status: rawEpisode.status,
    title: rawEpisode.title,
    token: rawEpisode.token,
  }
}

async function simplecast(url, opts = {}) {
  const response = await fetch(`${API_URL_ROOT}${url}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${API_KEY}`,
    },
    ...opts,
  })

  return await response.json()
}

export async function getEpisodes() {
  return await simplecast(
    `/podcasts/${SHOW_ID}/episodes?limit=5&offset=0&sort=published_at_desc`
  )
    .then((res) => res.collection.filter((ep) => ep.status === 'published'))
    .then((res) => res.map(transformEpisodeData))
    .catch((err) => {
      console.error(err)
      return []
    })
}

export default {
  id: 1034,
  name: 'Design Details',
  slug: 'design-details',
  description: 'A weekly conversation about design process and culture',
  simplecastId: 1034,
  artworkUrl: '/static/img/shows/designdetails.jpg',
  iTunesUrl: 'https://geo.itunes.apple.com/ca/podcast/feed/id947191070',
  overcastUrl: 'https://overcast.fm/itunes947191070',
  pocketCastsUrl: 'http://pca.st/itunes/947191070',
  rssFeedUrl: 'http://simplecast.fm/podcasts/1034/rss',
  spotifyUrl:
    'https://open.spotify.com/show/7kAx8RJce757LXVoX2FIpf?si=u_EJ07bBQKC-86Ypqhyn0A',
  googlePodcastsUrl:
    'https://play.google.com/music/m/Iyvjpq3k44ux2azsmvlxe3cc5by?t=Design_Details',
  castroUrl: 'https://castro.fm/itunes/947191070',
  breakerUrl: 'https://www.breaker.audio/design-details',
  applePodcastId: '947191070',
  twitterUsername: 'designdetailsfm',
  colors: {
    text: '#3D7B79',
    button: '#499290',
  },
}
