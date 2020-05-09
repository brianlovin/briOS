import * as React from 'react'

export default function Fathom() {
  React.useEffect(() => {
    const tracker = window.document.createElement('script')
    const firstScript = window.document.getElementsByTagName('script')[0]
    tracker.defer = true
    tracker.setAttribute('site', process.env.FATHOM_SITE_ID)
    tracker.setAttribute('spa', 'auto')
    tracker.setAttribute('excluded-domains', 'localhost,now.sh')
    tracker.setAttribute('included-domains', 'brianlovin.com')
    tracker.src = process.env.FATHOM_CUSTOM_URL
    firstScript.parentNode.insertBefore(tracker, firstScript)
  }, [])

  return null
}
