import * as React from 'react'
import '~/styles/tailwind.css'
import 'tailwindcss/utilities.css'
import '~/styles/custom-styles.css'
import '~/styles/syntax-highlighting.css'
import '~/styles/prose-styles.css'
import { SiteLayout } from '~/components/Layouts'
import Providers from '~/components/Providers'

export default function App({ Component, pageProps }) {
  return (
    <Providers pageProps={pageProps}>
      <SiteLayout>
        <Component {...pageProps} />
      </SiteLayout>
    </Providers>
  )
}
