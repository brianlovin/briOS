import * as React from 'react'
import { GET_POST, GET_POSTS } from '~/graphql/queries'
import PostContainer from '~/components/Writing/Post'
import { ListDetailView, SiteLayout } from '~/components/Layouts'
import { addApolloState, initApolloClient } from '~/lib/apollo/client'
import { PostsList } from '~/components/Writing/List'

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

WritingPostPage.getLayout = function getLayout(page) {
  return (
    <SiteLayout pageProps={page.props}>
      <ListDetailView list={<PostsList />} detail={page} />
    </SiteLayout>
  )
}

export default WritingPostPage
