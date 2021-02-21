import * as React from 'react'
import Page, { PageHeader } from '~/components/Page'
import { Post } from '~/graphql/types.generated'
import OverthoughtSubscribeBox from '~/components/Overthought/Subscribe'
import OverthoughtList from '~/components/Overthought/List'
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

function Overthought({ data }: Props) {
  return (
    <Page>
      <Head>
        <link
          rel="alternate"
          type="application/rss+xml"
          title="RSS Feed for Overthought"
          href="/writing/rss"
        />
      </Head>

      <NextSeo
        title={routes.writing.seo.title}
        description={routes.writing.seo.description}
        openGraph={routes.writing.seo.openGraph}
      />

      <CenteredColumn>
        <div data-cy="overthought" className="flex flex-col space-y-14">
          <PageHeader
            title="Overthought"
            subtitle="Thinking out loud about design, development, and building
              excellent software."
          />

          <OverthoughtSubscribeBox />
          {data && data.posts && <OverthoughtList posts={data.posts} />}
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

export default Overthought
