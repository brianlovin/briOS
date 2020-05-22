import * as React from 'react'
import { Post } from '~/graphql/types.generated'
import { GET_POST, GET_POSTS } from '~/graphql/queries'
import Page from '~/components/Page'
import PostContainer from '~/components/Overthought/Post'
import NotFound from '~/components/Overthought/NotFound'
import { initApolloClient } from '~/graphql/services/apollo'

interface Props {
  slug: string
  data: {
    post: Post
  }
}

function OverthoughtPost({ data }: Props) {
  const post = data?.post

  if (!post) return <NotFound />

  return (
    <Page withHeader>
      <PostContainer post={post} />
    </Page>
  )
}

export async function getStaticPaths() {
  const client = await initApolloClient({})
  const { data } = await client.query({ query: GET_POSTS })

  if (!data) return { paths: [], fallback: true }

  const paths = data.posts.map(({ slug }) => ({
    params: { slug },
  }))

  return { paths, fallback: true }
}

export async function getStaticProps({ params: { slug } }) {
  const client = await initApolloClient({})
  const { data } = await client.query({
    query: GET_POST,
    variables: { slug, first: 5 },
  })

  return {
    // because this data is slightly more dynamic, update it every hour
    unstable_revalidate: 60 * 60,
    props: {
      slug,
      data: {
        post: data.post,
      },
    },
  }
}

export default OverthoughtPost
