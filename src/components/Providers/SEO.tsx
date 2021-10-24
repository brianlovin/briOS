import Head from 'next/head'
import { useRouter } from 'next/router'
import { DefaultSeo } from 'next-seo'
import * as React from 'react'

import { baseUrl, defaultSEO } from '~/config/seo'

export function SEO() {
  const router = useRouter()

  let emoji = '👾'
  if (router.route.indexOf('/about') === 0) emoji = '👋'
  if (router.route.indexOf('/writing') === 0) emoji = '🤔'
  if (router.route.indexOf('/app-dissection') === 0) emoji = '✨'
  if (router.route.indexOf('/bookmarks') === 0) emoji = '📖'

  return (
    <React.Fragment>
      <DefaultSeo {...defaultSEO} />
      <Head>
        <meta name="theme-color" content={'#fefefe'} />
        <link rel="apple-touch-icon" href="/static/meta/apple-touch-icon.png" />
        <link
          rel="mask-icon"
          href="/static/meta/mask-icon.svg"
          color={'#050505'}
        />
        <link rel="manifest" href="/static/meta/manifest.json" />
        <link
          rel="icon"
          href={`data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>${emoji}</text></svg>`}
        />
        <link
          rel="alternate"
          type="application/rss+xml"
          title="RSS feed"
          href={`${baseUrl}/writing/rss`}
        />
        <meta
          name="theme-color"
          content="#fff"
          media="(prefers-color-scheme: light)"
        />
        <meta
          name="theme-color"
          content="rgb(23, 23, 23)"
          media="(prefers-color-scheme: dark)"
        />
      </Head>
    </React.Fragment>
  )
}
