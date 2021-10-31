/*

Whenever a user signs in or out, sync their data to our databse.
If the user is new, we will create their user record. Otherwise,
we use these moments to refresh their Twitter data like avatar,
name, and description

*/

import { prisma } from '~/lib/prisma'

import { getUser } from './getUser'

export async function afterCallback(_, __, session) {
  const { user } = session
  const { sub: id } = user
  const details = await getUser(id)
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
  } catch (error) {
    console.error(error)
  }

  return session
}
