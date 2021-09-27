/*

Whenever a user signs in or out, sync their data to our databse.
If the user is new, we will create their user record. Otherwise,
we use these moments to refresh their Twitter data like avatar,
name, and description

*/

import { prisma } from '~/lib/prisma/client'

const BASE_URL = process.env.AUTH0_ISSUER_BASE_URL

async function getToken() {
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

async function getUserDetails(id) {
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

export async function afterCallback(_, __, session) {
  const { user } = session
  const { sub: id } = user
  const details = await getUserDetails(id)
  const { description, location, name, nickname, picture, screen_name } =
    details
  try {
    await prisma.user.upsert({
      where: {
        twitterId: id,
      },
      update: {
        description,
        location,
        name,
        nickname,
        avatar: picture.replace('_normal', '_400x400'),
      },
      create: {
        description,
        location,
        name,
        nickname,
        avatar: picture.replace('_normal', '_400x400'),
        username: screen_name,
        twitterId: id,
      },
    })
  } catch (error) {}

  return session
}
