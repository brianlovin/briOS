import fetch from 'isomorphic-unfetch'
import { IS_PROD } from '~/graphql/constants'
import { useLocalFiles } from '~/graphql/helpers/useLocalFiles'

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
  async function getFreshData() {
    return await simplecast(
      `/podcasts/${SHOW_ID}/episodes?limit=10&offset=0&sort=published_at_desc`
    )
      .then((res) => res.collection.filter((ep) => ep.status === 'published'))
      .then((res) => res.map(transformEpisodeData))
      .catch((err) => {
        console.error(err)
        return []
      })
  }

  if (IS_PROD) {
    return await getFreshData()
  } else {
    return useLocalFiles({ path: 'recentEpisodes', fetch: getFreshData })
  }
}
