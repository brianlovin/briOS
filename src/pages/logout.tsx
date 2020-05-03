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

/*
  withApollo is needed to automatically wrap this page in an ApolloProvider,
  allowing for the use of mutationHooks on the client.
*/
export default withApollo(Logout)
