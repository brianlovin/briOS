import * as React from 'react'
import { BlogPost } from '~/types'
import { fetcher } from '~/api'
import { POST, POSTS } from '~/api/queries'
import Page from '~/components/Page'
import Post from '~/components/Overthought/Post'
import NotFound from '~/components/Overthought/NotFound'
import useSWR, { mutate } from 'swr'

interface Props {
  slug: string
  data: {
    post: BlogPost
    posts: BlogPost[]
  }
}

function OverthoughtPost(props: Props) {
  const { data } = useSWR(
    [POST, props.slug],
    (query, slug) => fetcher({ query, variables: { slug } }),
    { initialData: props.data }
  )

  React.useEffect(() => {
    mutate([POST, props.slug])
  }, [])

  return (
    <Page withHeader>
      {data && data.post ? (
        <Post post={data.post} posts={data.posts} />
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
