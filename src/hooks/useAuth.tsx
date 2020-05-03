import { useIsMeQuery } from '~/graphql/types.generated'

export function useAuth() {
  const { data } = useIsMeQuery()

  return {
    isMe: data && data.isMe,
  }
}
