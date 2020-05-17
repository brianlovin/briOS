import * as React from 'react'
import Page from '~/components/Page'
import { NextSeo } from 'next-seo'
import { GET_TOP_HN_POSTS, GET_HN_POST } from '~/graphql/queries'
import { initApolloClient } from '~/graphql/services/apollo'
import { withApollo } from '~/components/withApollo'
import { CenteredColumn } from '~/components/Layouts'
import HNPost from '~/components/HNPost'
import { useRouter } from 'next/router'
import FullscreenLoading from '~/components/FullscreenLoading'

interface Props {
  id: string
}

function HNPostView(props: Props) {
  const { id } = props

  const router = useRouter()

  if (router.isFallback) {
    return <FullscreenLoading />
  }

  return (
    <Page withHeader>
      <NextSeo
        title={'Hacker News'}
        description={'My personal Hacker News reader.'}
        openGraph={{
          title: 'Hacker News',
          description: 'My personal Hacker News reader.',
          images: [
            {
              url: 'https://brianlovin.com/static/meta/hn.png',
              alt: 'Hacker News',
            },
          ],
        }}
      />

      <CenteredColumn data-cy="hn">
        <HNPost id={id} />
      </CenteredColumn>
    </Page>
  )
}

export async function getStaticPaths() {
  const client = await initApolloClient({})

  const { data: topPosts } = await client.query({
    query: GET_TOP_HN_POSTS,
    variables: { sort: 'top' },
  })

  const { data: bestPosts } = await client.query({
    query: GET_TOP_HN_POSTS,
    variables: { sort: 'best' },
  })

  if (!topPosts && !bestPosts) return { paths: [], fallback: true }

  const posts = [...topPosts.hnPosts, ...bestPosts.hnPosts]

  const paths = posts.map(({ id }) => ({
    params: { id },
  }))

  return { paths, fallback: true }
}

export async function getStaticProps({ params: { id } }) {
  const client = await initApolloClient({})

  await client.query({ query: GET_HN_POST, variables: { id } })

  return {
    // because this data is slightly more dynamic, update it every hour
    unstable_revalidate: 60 * 60,
    props: {
      id: id,
    },
  }
}

export default withApollo(HNPostView)
