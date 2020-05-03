import { useEffect } from 'react'
import { useAuth } from '~/hooks/useAuth'

export default function Logout() {
  useEffect(() => {
    const { logout } = useAuth()
    logout()
  }, [])

  return null
}
