import { authorize } from '@liveblocks/node'
const secret = process.env.LIVEBLOCKS_API_KEY
export default async function auth(req, res) {
  const room = req.body.room
  const result = await authorize({ room, secret })
  return res.status(result.status).end(result.body)
}
