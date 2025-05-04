import { UserInputError } from 'apollo-server-errors'
import jwt from 'jsonwebtoken'

import { baseEmail } from '~/config/seo'
import { CLIENT_URL, IS_PROD } from '~/graphql/constants'
import { Context } from '~/graphql/context'
import { MutationEditUserArgs } from '~/graphql/types.generated'
import { client as postmark } from '~/lib/postmark'
import { validEmail, validUsername } from '~/lib/validators'

export async function deleteUser(_, __, ctx: Context) {
  const { prisma, viewer } = ctx

  if (viewer.isAdmin) {
    throw new UserInputError("Admins can't be deleted")
  }

  return await prisma.user
    .delete({
      where: { id: viewer.id },
    })
    .then(() => true)
}

export async function editUser(_, args: MutationEditUserArgs, ctx: Context) {
  const { prisma, viewer } = ctx
  const { data } = args
  const { username, email } = data

  if (username) {
    if (!validUsername(username)) {
      throw new UserInputError('Usernames can be 16 characters long')
    }

    const user = await prisma.user.findUnique({
      where: { username },
    })

    if (user && user.id !== viewer.id) {
      throw new UserInputError('That username is taken')
    }

    return await prisma.user.update({
      where: { id: viewer.id },
      data: { username },
    })
  }

  if (email) {
    if (!validEmail(email)) {
      throw new UserInputError('That email is not valid')
    }

    const userByEmail = await prisma.user.findUnique({
      where: { email },
    })

    if (userByEmail && userByEmail.id !== viewer.id) {
      throw new UserInputError('That email is taken')
    }

    // the user is updating their email to be the same thing
    if (userByEmail && userByEmail.id === viewer.id) {
      if (userByEmail.email === email) {
        return userByEmail
      }
    }

    const token = jwt.sign(
      { userId: viewer.id, pendingEmail: email },
      process.env.JWT_SIGNING_KEY
    )

    const url = `${CLIENT_URL}/api/email/confirm?token=${token}`

    if (IS_PROD) {
      postmark.sendEmailWithTemplate({
        From: baseEmail,
        To: email,
        TemplateId: 25539089,
        TemplateModel: { url },
      })
    } else {
      console.log('Sending confirmation email', {
        From: baseEmail,
        To: email,
        TemplateId: 25539089,
        TemplateModel: { url },
      })
    }

    return await prisma.user.update({
      where: { id: viewer.id },
      data: { pendingEmail: email },
    })
  }

  // if no email or username were passed, the user is trying to cancel the pending email request
  return await prisma.user.update({
    where: { id: viewer.id },
    data: { pendingEmail: null },
  })
}
