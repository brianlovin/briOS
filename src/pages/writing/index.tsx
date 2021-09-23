import * as React from 'react'
import { PostsList } from '~/components/Writing/List'
import { GET_POSTS } from '~/graphql/queries'
import { ListDetailView } from '~/components/Layouts'
import Head from 'next/head'
import { NextSeo } from 'next-seo'
import routes from '~/config/routes'
import { addApolloState, initApolloClient } from '~/lib/apollo/client'

export default function WritingPage() {
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

      <ListDetailView list={<PostsList />} detail={null} />
    </>
  )
}

export async function getServerSideProps() {
  const apolloClient = await initApolloClient()
  await apolloClient.query({ query: GET_POSTS })
  return addApolloState(apolloClient, {
    props: {},
  })
}
