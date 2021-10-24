import { NextSeo } from 'next-seo'
import * as React from 'react'

import { baseUrl } from '~/config/seo'
import { Post } from '~/graphql/types.generated'

interface Props {
  post: Post
}

export function SEO({ post }: Props) {
  return (
    <React.Fragment>
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
        }}
        twitter={{
          cardType: 'summary_large_image',
        }}
      />
    </React.Fragment>
  )
}
