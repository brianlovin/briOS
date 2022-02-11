import { useRouter } from 'next/router'
import { useEffect } from 'react'
import toast from 'react-hot-toast'

export function LoginErrorToast() {
  const router = useRouter()
  const errorCode = router.query['error_code']

  useEffect(() => {
    if (errorCode) {
      if (errorCode === 'access_denied') {
        toast.error('Sign in failed. Try again?')
      } else {
        toast.error('Sorry, something went wrong.')
      }

      // Remove the query parameter from the visible URL.
      router.replace(router.pathname)
    }
  }, [errorCode])

  return null
}
