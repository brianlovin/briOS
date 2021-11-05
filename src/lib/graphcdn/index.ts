import { GRAPHCDN_PURGE_ENDPOINT, IS_PROD } from '~/graphql/constants'

async function handleFetch(query) {
  if (!IS_PROD) {
    return console.log('Purging GraphCDN cache: ', query)
  }

  return await fetch(GRAPHCDN_PURGE_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'graphcdn-token': process.env.GRAPHCDN_PURGE_KEY,
    },
    body: JSON.stringify({
      query,
    }),
  }).catch((e) => {
    console.error('Error purging GraphCDN cache: ', e)
  })
}

export const graphcdn = {
  async purgeList(listName) {
    return await handleFetch(`mutation { _purgeQuery(queries:[${listName}]) }`)
  },

  async purgeBookmark(id) {
    return await handleFetch(`mutation { purgeBookmark(id: [${id}]) }`)
  },

  async purgePost(id) {
    return await handleFetch(`mutation { purgePost(id: [${id}]) }`)
  },

  async purgeStack(id) {
    return await handleFetch(`mutation { purgeStack(id: [${id}]) }`)
  },

  async purgeQuestion(id) {
    return await handleFetch(`mutation { purgeQuestion(id: [${id}]) }`)
  },

  async purgeUser(id) {
    return await handleFetch(`mutation { purgeUser(id: [${id}]) }`)
  },
}
