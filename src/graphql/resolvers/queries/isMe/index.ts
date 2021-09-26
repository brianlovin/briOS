export function isMe(_, __, { viewer }) {
  return viewer && viewer.role === 'ADMIN'
}
