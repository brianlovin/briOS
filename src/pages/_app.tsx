import '~/styles/custom-styles.css'
import '~/styles/dracula.css'
import '~/styles/prose-styles.css'

import * as React from 'react'

import { SiteLayout } from '~/components/Layouts'
import { LoginErrorToast } from '~/components/LoginErrorToast'
import { Providers } from '~/components/Providers'

export default function App({ Component, pageProps }) {
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
