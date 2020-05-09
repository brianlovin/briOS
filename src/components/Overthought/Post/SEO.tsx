import * as React from 'react'
import { NextSeo } from 'next-seo'
import Head from 'next/head'
import { Post } from '~/graphql/types.generated'

interface Props {
  post: Post
}

export default function SEO({ post }: Props) {
  return (
    <React.Fragment>
      <Head>
        <link
          rel="alternate"
          type="application/rss+xml"
          title="RSS Feed for Overthought"
          href="https://brianlovin.com/overthought/rss"
        />
      </Head>

      <NextSeo
        title={post.title}
        description={post.custom_excerpt || post.excerpt}
        openGraph={{
          title: post.title,
          url: `https://brianlovin.com/overthought/${post.slug}`,
          description: post.custom_excerpt || post.excerpt,
          images: [
            {
              url: post.feature_image
                ? post.feature_image
                : 'https://brianlovin.com/static/meta/overthought.png',
              alt: post.title,
            },
          ],
          site_name: 'Overthought',
        }}
        twitter={{
          cardType: 'summary_large_image',
        }}
      />
    </React.Fragment>
  )
}
