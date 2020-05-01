import * as React from 'react'
import { Post } from '~/types/graphql'
import { fetcher } from '~/graphql/api'
import { getPost, getPosts } from '~/graphql/queries/queries'
import Page from '~/components/Page'
import PostContainer from '~/components/Overthought/Post'
import NotFound from '~/components/Overthought/NotFound'

interface Props {
  slug: string
  data: {
    post: Post
    posts: Post[]
  }
}

function OverthoughtPost({ data }: Props) {
  const post = data?.post
  const posts = data?.posts

  if (!post) return <NotFound />

  return (
    <Page withHeader>
      <PostContainer post={post} posts={posts} />
    </Page>
  )
}

export async function getStaticPaths() {
  const data = await fetcher({ query: getPosts })

  if (!data) return { paths: [], fallback: true }

  const paths = data.posts.map(({ slug }) => ({
    params: { slug },
  }))

  return { paths, fallback: true }
}

export async function getStaticProps({ params: { slug } }) {
  const postQuery = await fetcher({
    query: getPost,
    variables: { slug, first: 5 },
  })

  return {
    unstable_revalidate: true,
    props: {
      slug,
      data: {
        post: postQuery.post,
        posts: postQuery.posts,
      },
    },
  }
}

export default OverthoughtPost
