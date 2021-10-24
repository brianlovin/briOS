import * as React from 'react'
import { GET_POST, GET_POSTS } from '~/graphql/queries/posts'
import PostContainer from '~/components/Writing/Post'
import { ListDetailView, SiteLayout } from '~/components/Layouts'
import { addApolloState, initApolloClient } from '~/lib/apollo/client'
import { PostsList } from '~/components/Writing/List'
import { withProviders } from '~/components/Providers/withProviders'

function WritingPostPage({ slug }) {
  return <PostContainer slug={slug} />
}

export async function getStaticPaths() {
  const apolloClient = await initApolloClient({})
  const { data } = await apolloClient.query({ query: GET_POSTS })

  if (!data) return { paths: [], fallback: true }

  const paths = data.posts.map(({ slug }) => ({
    params: { slug },
  }))

  return { paths, fallback: true }
}

export async function getStaticProps({ params: { slug } }) {
  const apolloClient = await initApolloClient({})

  await Promise.all([
    apolloClient.query({
      query: GET_POST,
      variables: { slug },
    }),
    apolloClient.query({ query: GET_POSTS }),
  ])

  return addApolloState(apolloClient, {
    props: {
      slug,
    },
  })
}

WritingPostPage.getLayout = withProviders(function getLayout(page) {
  return (
    <SiteLayout>
      <ListDetailView list={<PostsList />} hasDetail detail={page} />
    </SiteLayout>
  )
})

export default WritingPostPage
