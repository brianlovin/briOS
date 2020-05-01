import * as React from 'react'
import { AppProps } from 'next/app'
import Providers from '~/components/Providers'
import '~/components/GlobalStyles/theme.css'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Providers>
      <Component {...pageProps} />
    </Providers>
  )
}
