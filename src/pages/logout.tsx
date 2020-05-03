import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useLogoutMutation } from '~/graphql/types.generated'
import { withApollo } from '~/components/withApollo'

function Logout() {
  const router = useRouter()
  const [handleLogout] = useLogoutMutation({
    onCompleted: () => router.push('/'),
  })

  useEffect(() => {
    handleLogout()
  }, [])

  return <p>Logging out...</p>
}

export default withApollo(Logout)
