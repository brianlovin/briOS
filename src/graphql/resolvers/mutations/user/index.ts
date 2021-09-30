import { UserInputError } from 'apollo-server-errors'
import { Context } from '~/graphql/context'
import { UserRole } from '~/graphql/types.generated'
import { deleteUser as deleteUserFromAuth0 } from '~/lib/auth0/deleteUser'

export async function deleteUser(_, __, ctx: Context) {
  const { prisma, viewer } = ctx

  if (viewer.role === UserRole.Admin) {
    throw new UserInputError('Admins can’t be deleted')
  }

  const user = await prisma.user.findUnique({ where: { id: viewer.id } })
  await deleteUserFromAuth0(user.twitterId)

  return await prisma.user
    .delete({
      where: {
        id: viewer.id,
      },
    })
    .then(() => true)
}
