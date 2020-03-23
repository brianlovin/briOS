import * as React from 'react'
import Head from 'next/head'
import { DefaultSeo } from 'next-seo'
import { light } from '~/components/Theme'

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
          sizes="57x57"
          href="/static/meta/apple-icon-57x57.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="60x60"
          href="/static/meta/apple-icon-60x60.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="72x72"
          href="/static/meta/apple-icon-72x72.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="76x76"
          href="/static/meta/apple-icon-76x76.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="114x114"
          href="/static/meta/apple-icon-114x114.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="120x120"
          href="/static/meta/apple-icon-120x120.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="144x144"
          href="/static/meta/apple-icon-144x144.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="152x152"
          href="/static/meta/apple-icon-152x152.png"
        />
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
        <meta name="msapplication-TileColor" content={light.accent.blue} />
        <meta name="msapplication-TileImage" content="/ms-icon-144x144.png" />
        <meta name="theme-color" content={light.accent.blue} />
        <link
          rel="mask-icon"
          href="/static/meta/website_icon.svg"
          color={light.text.primary}
        ></link>
      </Head>
    </React.Fragment>
  )
}
