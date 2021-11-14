import * as React from 'react'

export function Fathom() {
  React.useEffect(() => {
    const tracker = window.document.createElement('script')
    const firstScript = window.document.getElementsByTagName('script')[0]
    tracker.defer = true
    tracker.setAttribute('site', process.env.NEXT_PUBLIC_FATHOM_SITE_ID)
    tracker.setAttribute('spa', 'auto')
    tracker.setAttribute('excluded-domains', 'localhost,now.sh,vercel.app')
    tracker.setAttribute('included-domains', 'brianlovin.com')
    tracker.src = process.env.NEXT_PUBLIC_FATHOM_CUSTOM_URL
    firstScript.parentNode.insertBefore(tracker, firstScript)
  }, [])

  return null
}
