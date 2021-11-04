import { useRouter } from 'next/router'
import * as React from 'react'

import { PostDetail } from '~/components/HackerNews/PostDetail'
import { PostsList } from '~/components/HackerNews/PostsList'
import { ListDetailView, SiteLayout } from '~/components/Layouts'
import { Detail } from '~/components/ListDetail/Detail'
import { withProviders } from '~/components/Providers/withProviders'
import { getContext } from '~/graphql/context'
import {
  GET_HACKER_NEWS_POST,
  GET_HACKER_NEWS_POSTS,
} from '~/graphql/queries/hackerNews'
import { addApolloState, initApolloClient } from '~/lib/apollo'

function HNPostPage({ id }) {
  const router = useRouter()

  if (router.isFallback) {
    return <Detail.Loading />
  }

  return <PostDetail id={id} />
}

export async function getServerSideProps({ params: { id }, req, res }) {
  const context = await getContext(req, res)
  const apolloClient = initApolloClient({ context })

  await Promise.all([
    apolloClient.query({
      query: GET_HACKER_NEWS_POSTS,
    }),

    apolloClient.query({
      query: GET_HACKER_NEWS_POST,
      variables: { id },
    }),
  ])

  return addApolloState(apolloClient, {
    props: {
      id,
    },
  })
}

HNPostPage.getLayout = withProviders(function getLayout(page) {
  return (
    <SiteLayout>
      <ListDetailView list={<PostsList />} hasDetail detail={page} />
    </SiteLayout>
  )
})

export default HNPostPage
