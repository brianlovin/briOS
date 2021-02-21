import * as React from 'react'
import { NextSeo } from 'next-seo'
import Head from 'next/head'
import { Post } from '~/graphql/types.generated'
import { baseUrl } from '~/config/seo'

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
          href={`${baseUrl}/writing/rss`}
        />
      </Head>

      <NextSeo
        title={post.title}
        description={post.custom_excerpt || post.excerpt}
        openGraph={{
          title: post.title,
          url: `${baseUrl}/writing/${post.slug}`,
          description: post.custom_excerpt || post.excerpt,
          images: [
            {
              url:
                post.feature_image ||
                `${baseUrl}/static/img/writing/${post.slug}.png`,
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
