import * as React from 'react'
import { useRouter } from 'next/router'
import { useLoginMutation } from '~/graphql/types.generated'
import { withApollo } from '~/components/withApollo'

function Login() {
  const router = useRouter()
  const [password, setPassword] = React.useState('')

  const [handleLogin] = useLoginMutation({
    variables: { password },
    onCompleted: (data) => data.login && router.push('/'),
  })

  function onSubmit(e) {
    e.preventDefault()
    handleLogin()
  }

  return (
    <form onSubmit={onSubmit}>
      <input
        type="text"
        placeholder="password"
        onChange={(e) => setPassword(e.target.value)}
      />
    </form>
  )
}

export default withApollo(Login)
