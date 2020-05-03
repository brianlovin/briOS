import * as React from 'react'
import { useRouter } from 'next/router'
import { useLoginMutation } from '~/graphql/types.generated'
import { withApollo } from '~/components/withApollo'
import { FullscreenContainer, FullscreenContent } from '~/components/Page/style'
import { Input } from '~/components/Overthought/Feedback/style'

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
    <FullscreenContainer>
      <FullscreenContent>
        <form
          style={{
            background: 'var(--bg-inset)',
            borderRadius: '12px',
            padding: '32px',
          }}
          onSubmit={onSubmit}
        >
          <Input
            type="text"
            placeholder="password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </form>
      </FullscreenContent>
    </FullscreenContainer>
  )
}

export default withApollo(Login)
