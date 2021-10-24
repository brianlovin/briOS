import * as React from 'react'
import '~/styles/tailwind.css'
import 'tailwindcss/utilities.css'
import '~/styles/custom-styles.css'
import '~/styles/syntax-highlighting.css'
import '~/styles/prose-styles.css'
import { Providers } from '~/components/Providers'
import { SiteLayout } from '~/components/Layouts'

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
