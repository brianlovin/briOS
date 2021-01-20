import * as React from 'react'
import App from 'next/app'
import Sentry from '~/sentry'
import Providers from '~/components/Providers'
import '~/styles/tailwind.css'
import 'tailwindcss/utilities.css'
import '~/styles/custom-styles.css'

class MyApp extends App {
  componentDidCatch(error, errorInfo) {
    Sentry.withScope((scope) => {
      Object.keys(errorInfo).forEach((key) => {
        scope.setExtra(key, errorInfo[key])
      })

      Sentry.captureException(error)
    })

    super.componentDidCatch(error, errorInfo)
  }

  render() {
    const { Component, pageProps } = this.props

    return (
      <Providers>
        <Component {...pageProps} />
      </Providers>
    )
  }
}

export default MyApp
