import { IS_PROD } from '~/graphql/constants'
import { useLocalFiles } from '~/graphql/helpers/useLocalFiles'

const headers = {
  Authorization: `Token ${process.env.REVUE_API_KEY}`,
}

const REVUE_BASE_URL = 'https://www.getrevue.co/api/v2'

async function getSubscriber({ email }) {
  async function getSubscribers() {
    const res = await fetch(`${REVUE_BASE_URL}/subscribers`, {
      method: 'GET',
      headers,
    })

    return await res.json()
  }

  if (IS_PROD) {
    const subscribers = await getSubscribers()
    return subscribers.find((sub) => sub.email === email)
  } else {
    const subscribers = await useLocalFiles({
      path: 'revueSubscribers',
      fetch: getSubscribers,
    })
    return subscribers.find((sub) => sub.email === email)
  }
}

async function addSubscriber({ email, doubleOptIn }) {
  const result = await fetch(`${REVUE_BASE_URL}/subscribers`, {
    method: 'POST',
    headers: {
      ...headers,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, double_opt_in: doubleOptIn }),
  })
  const data = await result.json()
  return data
}

async function removeSubscriber({ email, doubleOptIn }) {
  const result = await fetch(`${REVUE_BASE_URL}/subscribers/unsubscribe`, {
    method: 'POST',
    headers: {
      ...headers,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, double_opt_in: doubleOptIn }),
  })
  const data = await result.json()
  return data
}

export const revue = {
  getSubscriber,
  addSubscriber,
  removeSubscriber,
}
