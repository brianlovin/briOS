import { authorize } from '@liveblocks/node'
import { IS_PROD } from '~/graphql/constants'
export default async function auth(req, res) {
  const secret = IS_PROD
    ? process.env.LIVEBLOCKS_API_KEY
    : process.env.LIVEBLOCKS_TEST_KEY

  const room = req.body.room
  const result = await authorize({ room, secret })
  return res.status(result.status).end(result.body)
}
