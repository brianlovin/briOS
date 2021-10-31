import { BASE_URL } from '.'
import { getToken } from './getToken'

export async function deleteUser(id) {
  const token = await getToken()
  const url = `${BASE_URL}/api/v2/users/${id}`
  const options = {
    method: 'DELETE',
    headers: {
      authorization: `Bearer ${token}`,
    },
  }

  return await fetch(url, options)
}
