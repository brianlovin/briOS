import * as React from 'react'
import Head from 'next/head'
import { DefaultSeo } from 'next-seo'
import theme from '~/components/Theme'

const SeoConfig = {
  title: 'Brian Lovin',
  description: 'Product designer',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://brianlovin.com',
    site_name: 'Brian Lovin',
    images: [
      {
        url: 'https://brianlovin.com/static/og-image.jpeg',
        width: 1600,
        height: 400,
        alt: 'Brian Lovin',
      },
    ],
  },
  twitter: {
    handle: '@brian_lovin',
    site: '@brian_lovin',
    cardType: 'summary_large_image',
  },
}

export default function SEO() {
  return (
    <React.Fragment>
      <DefaultSeo {...SeoConfig} />
      <Head>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/static/meta/apple-icon-180x180.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="192x192"
          href="/static/meta/android-icon-192x192.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/static/meta/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="96x96"
          href="/static/meta/favicon-96x96.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/static/meta/favicon-16x16.png"
        />
        <link rel="manifest" href="/static/meta/site.webmanifest" />
        <meta
          name="msapplication-TileColor"
          content={theme.colors['accent-blue'].light}
        />
        <meta name="msapplication-TileImage" content="/ms-icon-144x144.png" />
        <meta name="theme-color" content={theme.colors['accent-blue'].light} />
        <link
          rel="mask-icon"
          href="/static/meta/website_icon.svg"
          color={theme.colors['text-primary'].light}
        ></link>
      </Head>
    </React.Fragment>
  )
}
