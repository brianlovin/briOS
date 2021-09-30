import { BASE_URL } from '.'
import { getToken } from './getToken'

export async function getUser(id) {
  const token = await getToken()
  const url = `${BASE_URL}/api/v2/users/${id}`
  const options = {
    method: 'GET',
    headers: {
      authorization: `Bearer ${token}`,
    },
  }

  return await fetch(url, options).then((r) => r.json())
}
