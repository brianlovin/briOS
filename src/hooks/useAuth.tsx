import { useIsMeQuery } from '~/graphql/types.generated'

export function useAuth() {
  const { data } = useIsMeQuery({
    fetchPolicy: 'cache-first',
  })

  return {
    isMe: data && data.isMe,
  }
}
