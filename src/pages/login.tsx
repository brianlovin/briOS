import * as React from 'react'
import { useAuth } from '~/hooks/useAuth'

export default function Login() {
  const [password, setPassword] = React.useState('')
  const { login } = useAuth()

  function onSubmit(e) {
    e.preventDefault()
    return login(password)
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
