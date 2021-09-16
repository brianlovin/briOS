import * as React from 'react'
import { Post } from '~/graphql/types.generated'
import { GET_POST, GET_POSTS } from '~/graphql/queries'
import Page from '~/components/Page'
import PostContainer from '~/components/Writing/Post'
import NotFound from '~/components/Writing/NotFound'
import { initApolloClient } from '~/graphql/services/apollo'
import PostsList from '~/components/Writing/List'
import { ListDetailView } from '~/components/Layouts'

interface Props {
  slug: string
  data: {
    post: Post
    posts: Post[]
  }
}

function PostView({ data }: Props) {
  const post = data?.post

  if (!post) return <NotFound />

  return (
    <ListDetailView
      list={<PostsList posts={data.posts} />}
      detail={<PostContainer post={post} />}
    />
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
  const { data: postData } = await client.query({
    query: GET_POST,
    variables: { slug },
  })

  const { data: postsData } = await client.query({ query: GET_POSTS })

  return {
    // because this data is slightly more dynamic, update it every hour
    revalidate: 60 * 60,
    props: {
      slug,
      data: {
        post: postData.post,
        posts: postsData.posts,
      },
    },
  }
}

export default PostView
