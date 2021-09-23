import * as React from 'react'
import '~/styles/tailwind.css'
import 'tailwindcss/utilities.css'
import '~/styles/custom-styles.css'
import '~/styles/syntax-highlighting.css'
import '~/styles/prose-styles.css'
import { SiteLayout } from '~/components/Layouts'

export default function App({ Component, pageProps }) {
  const getLayout =
    Component.getLayout ||
    ((page) => <SiteLayout pageProps={page.props}>{page}</SiteLayout>)

  return getLayout(<Component {...pageProps} />)
}
