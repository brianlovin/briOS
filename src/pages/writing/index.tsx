import * as React from 'react'
import Page, { PageHeader } from '~/components/Page'
import { Post } from '~/graphql/types.generated'
import PostsList from '~/components/Writing/List'
import { GET_POSTS } from '~/graphql/queries'
import { initApolloClient } from '~/graphql/services/apollo'
import { CenteredColumn, ListViewOnly } from '~/components/Layouts'
import Head from 'next/head'
import { NextSeo } from 'next-seo'
import routes from '~/config/routes'
import InlineNewsletterSubscribeBox from '~/components/Newsletter/InlineNewsletter'

interface Props {
  data: {
    posts: Post[]
  }
}

function Writing({ data }: Props) {
  return (
    <>
      <Head>
        <link
          rel="alternate"
          type="application/rss+xml"
          title="RSS feed"
          href="/writing/rss"
        />
      </Head>

      <NextSeo
        title={routes.writing.seo.title}
        description={routes.writing.seo.description}
        openGraph={routes.writing.seo.openGraph}
      />

      <ListViewOnly list={<PostsList posts={data.posts} />} />
    </>
  )
}

export async function getStaticProps() {
  const client = await initApolloClient({})
  const { data } = await client.query({ query: GET_POSTS })
  return {
    // because this data is slightly more dynamic, update it every hour
    revalidate: 60 * 60,
    props: {
      data,
    },
  }
}

export default Writing
