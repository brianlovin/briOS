import * as React from 'react'
import { NextSeo } from 'next-seo'
import Head from 'next/head'

export default function OverthoughtSEO() {
  return (
    <React.Fragment>
      <Head>
        <link
          rel="alternate"
          type="application/rss+xml"
          title="RSS Feed for Paul's Message"
          href="/paulsmessage/rss"
        />
      </Head>
      <NextSeo
        title={"Paul's Message"}
        description={'Thoughts, stories and ideas.'}
        openGraph={{
          url: 'https://paulowe.com/paulsmessage',
          title: "Paul's Message",
          description: 'Thoughts, stories and ideas.',
          site_name: "Paul's Message",
          images: [
            {
              url: 'https://paulowe.com/static/meta/paulsmessage.png',
              alt: "Paul's Message",
            },
          ],
        }}
        twitter={{
          cardType: 'summary_large_image',
        }}
      />
    </React.Fragment>
  )
}
