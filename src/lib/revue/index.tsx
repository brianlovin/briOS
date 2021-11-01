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

  try {
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
  } catch (e) {
    console.error({ e })
    return null
  }
}

async function addSubscriber({ email, doubleOptIn }) {
  try {
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
  } catch (e) {
    console.error({ e })
    return null
  }
}

async function removeSubscriber({ email, doubleOptIn }) {
  try {
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
  } catch (e) {
    console.error({ e })
    return null
  }
}

async function getCurrentIssue() {
  try {
    const result = await fetch(`${REVUE_BASE_URL}/issues/current`, {
      headers: {
        ...headers,
      },
    })
    const data = await result.json()
    // this should return a single object, but revue returns an array containing
    // a single issue object
    return data[0]
  } catch (e) {
    console.error({ e })
    return null
  }
}

interface AddItemToIssueProps {
  id: string
  url: string
}
async function addItemToIssue({ id, url }: AddItemToIssueProps) {
  try {
    const result = await fetch(`${REVUE_BASE_URL}/issues/${id}/items`, {
      method: 'POST',
      headers: {
        ...headers,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ issue_id: id, url }),
    })
    const data = await result.json()
    return data
  } catch (e) {
    console.error({ e })
    return null
  }
}

export const revue = {
  getSubscriber,
  addSubscriber,
  removeSubscriber,
  getCurrentIssue,
  addItemToIssue,
}
