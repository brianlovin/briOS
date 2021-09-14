import * as React from 'react'
import Page, { PageHeader } from '~/components/Page'
import { Post } from '~/graphql/types.generated'
import WritingSubscribeBox from '~/components/Writing/Subscribe'
import PostsList from '~/components/Writing/List'
import { GET_POSTS } from '~/graphql/queries'
import { initApolloClient } from '~/graphql/services/apollo'
import { CenteredColumn } from '~/components/Layouts'
import Head from 'next/head'
import { NextSeo } from 'next-seo'
import routes from '~/config/routes'

interface Props {
  data: {
    posts: Post[]
  }
}

function Writing({ data }: Props) {
  return (
    <Page>
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

      <CenteredColumn>
        <div data-cy="writing" className=" space-y-12">
          <PageHeader
            title={routes.writing.seo.title}
            subtitle={routes.writing.seo.description}
          />
          
          <div className=" space-y-6">
            {data && data.posts && <PostsList posts={data.posts} />}
          </div>
        </div>
      </CenteredColumn>
    </Page>
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
