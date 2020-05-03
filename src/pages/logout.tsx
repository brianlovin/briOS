import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useLogoutMutation } from '~/graphql/types.generated'
import { withApollo } from '~/components/withApollo'
import FullscreenLoading from '~/components/FullscreenLoading'

function Logout() {
  const router = useRouter()
  const [handleLogout] = useLogoutMutation({
    onCompleted: () => router.push('/'),
  })

  useEffect(() => {
    handleLogout()
  }, [])

  return <FullscreenLoading />
}

export default withApollo(Logout)
