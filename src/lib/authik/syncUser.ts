/*

Whenever a user signs in or out, sync their data to our database.
If the user is new, we will create their user record. Otherwise,
we use these moments to refresh their Twitter data like avatar,
name, and description

*/

import { User } from '@authik/nextjs'

import { prisma } from '~/lib/prisma'

export async function syncUser(authikUser: User) {
  const twitterProfile = authikUser.provider_profiles.find(
    (profile) => profile.type === 'twitter'
  )
  const {
    provider_id,
    name,
    username,
    avatar_url,
    twitter: { description, location },
  } = twitterProfile
  const legacyTwitterId = `twitter|${provider_id}`

  try {
    await prisma.user.upsert({
      where: {
        twitterId: legacyTwitterId,
      },
      update: {
        authikId: authikUser.id,
        description,
        location,
        name,
        avatar: avatar_url,
      },
      create: {
        authikId: authikUser.id,
        description,
        location,
        name,
        avatar: avatar_url,
        username: username,
        twitterId: legacyTwitterId,
      },
    })
  } catch (error) {
    console.error(error)
  }
}
