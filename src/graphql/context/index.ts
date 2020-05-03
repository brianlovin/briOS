import { isAuthenticated } from './isMe'

export default function context(ctx) {
  return {
    cookie: ctx.res.cookie,
    isMe: isAuthenticated(ctx.req),
  }
}
