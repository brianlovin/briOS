import * as React from 'react'
import { Post } from '~/types/graphql'
import { fetcher } from '~/api'
import { POST, POSTS } from '~/api/queries'
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
  return (
    <Page withHeader>
      {data && data.post ? (
        <PostContainer post={data.post} posts={data.posts} />
      ) : (
        <NotFound />
      )}
    </Page>
  )
}

export async function getStaticPaths() {
  const data = await fetcher({ query: POSTS })

  if (!data) return { paths: [], fallback: true }

  const paths = data.posts.map(({ slug }) => ({
    params: { slug },
  }))

  return { paths, fallback: true }
}

export async function getStaticProps({ params: { slug } }) {
  const postQuery = await fetcher({
    query: POST,
    variables: { slug, first: 5 },
  })

  return {
    revalidate: true,
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
