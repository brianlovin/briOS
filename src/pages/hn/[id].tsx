import * as React from 'react'
import Page from '~/components/Page'
import { NextSeo } from 'next-seo'
import { CenteredColumn } from '~/components/Layouts'
import { HNPost } from '~/components/HNPost'
import { useRouter } from 'next/router'
import FullscreenLoading from '~/components/FullscreenLoading'
import { getPostById, getPostIds } from '~/graphql/services/hn'
import { HNPost as HNPostType } from '.'

interface Props {
  post: HNPostType
}

export default function HNPostView(props: Props) {
  const { post } = props

  const router = useRouter()

  if (router.isFallback) {
    return <FullscreenLoading />
  }

  return (
    <Page>
      <NextSeo
        title={'Hacker News'}
        description={'My personal Hacker News reader.'}
        openGraph={{
          title: 'Hacker News',
          description: 'My personal Hacker News reader.',
          images: [
            {
              url: 'https://paulowe.com/static/meta/hn.jpeg',
              alt: 'Hacker News',
            },
          ],
        }}
      />

      <CenteredColumn data-cy="hn">
        <HNPost post={post} />
      </CenteredColumn>
    </Page>
  )
}

export async function getStaticPaths() {
  const topPostIds = await getPostIds('top')

  const postIds = topPostIds.slice(0, 16)

  const paths = postIds.map((id) => ({
    params: { id: id.toString() },
  }))

  return { paths, fallback: true }
}

export async function getStaticProps({ params: { id } }) {
  const post = await getPostById(id, true)

  return {
    revalidate: 60 * 60,
    props: {
      post,
    },
  }
}
