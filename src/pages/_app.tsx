import '~/styles/tailwind.css'
import 'tailwindcss/utilities.css'
import '~/styles/custom-styles.css'
import '~/styles/prose-styles.css'
import '~/styles/dracula.css'

import * as React from 'react'

import { SiteLayout } from '~/components/Layouts'
import { Providers } from '~/components/Providers'

export default function App({ Component, pageProps }) {
  const getLayout =
    Component.getLayout ||
    ((page) => (
      <Providers pageProps={pageProps}>
        <SiteLayout>{page}</SiteLayout>
      </Providers>
    ))

  return getLayout(<Component {...pageProps} />)
}
