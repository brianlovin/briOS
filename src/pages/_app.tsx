import '~/styles/custom-styles.css'
import '~/styles/dracula.css'
import '~/styles/prose-styles.css'

import * as Fathom from 'fathom-client'
import Router from 'next/router'
import * as React from 'react'
import { useEffect } from 'react'

import { SiteLayout } from '~/components/Layouts'
import { LoginErrorToast } from '~/components/LoginErrorToast'
import { Providers } from '~/components/Providers'

Router.events.on('routeChangeComplete', (as, routeProps) => {
  if (!routeProps.shallow) {
    Fathom.trackPageview()
  }
})

export default function App({ Component, pageProps }) {
  useEffect(() => {
    Fathom.load(process.env.NEXT_PUBLIC_FATHOM_SITE_ID, {
      includedDomains: ['brianlovin.com'],
      excludedDomains: ['vercel.app,localhost'],
      spa: 'auto',
    })
  }, [])

  const getLayout =
    Component.getLayout ||
    ((page) => (
      <Providers pageProps={pageProps}>
        <LoginErrorToast />
        <SiteLayout>{page}</SiteLayout>
      </Providers>
    ))

  return getLayout(<Component {...pageProps} />)
}
