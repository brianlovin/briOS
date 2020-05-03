import { useEffect } from 'react'
import { useAuth } from '~/hooks/useAuth'

export default function Logout() {
  const { logout } = useAuth()

  useEffect(() => {
    logout()
  }, [])

  return null
}
