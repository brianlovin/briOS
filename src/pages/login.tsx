import * as React from 'react'
import { useRouter } from 'next/router'
import { useLoginMutation } from '~/graphql/types.generated'
import { withApollo } from '~/components/withApollo'
import { Input } from '~/components/Input'
import Page from '~/components/Page'
import { NextSeo } from 'next-seo'
import routes from '~/config/routes'

function Login() {
  const router = useRouter()
  const [password, setPassword] = React.useState('')

  const [handleLogin] = useLoginMutation({
    variables: { password },
    onCompleted: (data) => data.login && router.push('/bookmarks'),
  })

  function onSubmit(e) {
    e.preventDefault()
    handleLogin()
  }

  return (
    <Page>
      <NextSeo
        title={routes.login.seo.title}
        description={routes.login.seo.description}
        openGraph={routes.login.seo.openGraph}
      />

      <div className="flex items-center justify-center w-screen h-screen">
        <form className="p-8 bg-gray-100 rounded-lg" onSubmit={onSubmit}>
          <Input
            autoFocus
            type="password"
            placeholder="password"
            autoComplete="current-password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </form>
      </div>
    </Page>
  )
}

/*
  withApollo is needed to automatically wrap this page in an ApolloProvider,
  allowing for the use of mutationHooks on the client.
*/
export default withApollo(Login)
