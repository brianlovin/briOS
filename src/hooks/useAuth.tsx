import { useRouter } from 'next/router'
import {
  useIsMeQuery,
  useLogoutMutation,
  useLoginMutation,
} from '~/graphql/types.generated'

export function useAuth() {
  const router = useRouter()

  const { data } = useIsMeQuery({
    fetchPolicy: 'cache-first',
  })

  const [handleLogout] = useLogoutMutation({
    onCompleted: () => router.push('/'),
  })

  const [handleLogin] = useLoginMutation({
    onCompleted: (data) => data.login && router.push('/'),
  })

  return {
    isMe: data && data.isMe,
    login: (password) => handleLogin({ variables: { password } }),
    logout: () => handleLogout(),
  }
}
