import * as React from 'react'
import Providers from '~/components/Providers'
import Sidebar from '~/components/Sidebar'
import '~/styles/tailwind.css'
import 'tailwindcss/utilities.css'
import '~/styles/custom-styles.css'
import '~/styles/syntax-highlighting.css'
import '~/styles/prose-styles.css'

function MyApp({ Component, pageProps }) {
  return (
    <Providers pageProps={pageProps}>
      <div className="relative flex w-full h-full">
        <Sidebar />

        <div className="flex flex-1">
          <Component {...pageProps} />
        </div>
      </div>
    </Providers>
  )
}

export default MyApp
