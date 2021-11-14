import * as React from 'react'

export function Fathom() {
  React.useEffect(() => {
    const tracker = window.document.createElement('script')
    const firstScript = window.document.getElementsByTagName('script')[0]
    tracker.defer = true
    tracker.setAttribute('data-site', process.env.NEXT_PUBLIC_FATHOM_SITE_ID)
    tracker.setAttribute('data-spa', 'auto')
    tracker.setAttribute('data-excluded-domains', 'localhost,now.sh,vercel.app')
    tracker.setAttribute('data-included-domains', 'brianlovin.com')
    tracker.src = process.env.NEXT_PUBLIC_FATHOM_CUSTOM_URL
    firstScript.parentNode.insertBefore(tracker, firstScript)
  }, [])

  return null
}
