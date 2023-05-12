import * as Fathom from 'fathom-client'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

export function FathomProvider() {
  const router = useRouter()
  useEffect(() => {
    Fathom.load(process.env.NEXT_PUBLIC_FATHOM_SITE_ID, {
      includedDomains: ['brianlovin.com'],
      excludedDomains: ['vercel.app,localhost'],
      spa: 'auto',
    })

    function onRouteChangeComplete() {
      Fathom.trackPageview()
    }

    router.events.on('routeChangeComplete', onRouteChangeComplete)

    return () => {
      router.events.off('routeChangeComplete', onRouteChangeComplete)
    }
  }, [])

  return null
}
