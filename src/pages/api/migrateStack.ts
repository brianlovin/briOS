import { NextApiRequest, NextApiResponse } from 'next'
import { stackData } from '~/components/Stack/data'
import { prisma } from '~/lib/prisma/client'

// id          String     @id @default(cuid())
// createdAt   DateTime   @default(now())
// updatedAt   DateTime   @updatedAt
// name        String
// description String     @db.VarChar(280)
// image       String

export default async (req: NextApiRequest, res: NextApiResponse) => {
  for (const stack of stackData) {
    try {
      console.log(`processing ${stack.name}`)

      try {
        if (stack.oss && stack.independent) {
          await prisma.stack.create({
            data: {
              name: stack.name,
              description: stack.description,
              image: stack.image,
              url: stack.url,
              tags: (stack.oss || stack.independent) && {
                connect: [
                  {
                    name: 'Open source',
                  },
                  {
                    name: 'Indie',
                  },
                ],
              },
            },
            include: {
              tags: true,
            },
          })
        } else if (stack.oss) {
          await prisma.stack.create({
            data: {
              name: stack.name,
              description: stack.description,
              image: stack.image,
              url: stack.url,
              tags: (stack.oss || stack.independent) && {
                connect: [
                  {
                    name: 'Open source',
                  },
                ],
              },
            },
            include: {
              tags: true,
            },
          })
        } else if (stack.independent) {
          await prisma.stack.create({
            data: {
              name: stack.name,
              description: stack.description,
              image: stack.image,
              url: stack.url,
              tags: (stack.oss || stack.independent) && {
                connect: [
                  {
                    name: 'Indie',
                  },
                ],
              },
            },
            include: {
              tags: true,
            },
          })
        } else {
          await prisma.stack.create({
            data: {
              name: stack.name,
              description: stack.description,
              image: stack.image,
              url: stack.url,
            },
          })
        }
      } catch (err) {
        console.log({ err, stack })
      }
    } catch (err) {
      console.log({ err })
    }
  }

  return res.status(201).json({ error: '' })
}
