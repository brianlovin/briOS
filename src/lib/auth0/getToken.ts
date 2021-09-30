import { BASE_URL } from '.'

export async function getToken() {
  const client_id = process.env.AUTH0_MANAGEMENT_CLIENT_ID
  const client_secret = process.env.AUTH0_MANAGEMENT_CLIENT_SECRET
  const url = `${BASE_URL}/oauth/token`
  const options = {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      client_id,
      client_secret,
      audience: `${BASE_URL}/api/v2/`,
      grant_type: 'client_credentials',
    }),
  }
  const token = await fetch(url, options).then((r) => r.json())
  return token.access_token
}
