import { useRouter } from 'next/router'
import * as React from 'react'

import { PostDetail } from '~/components/HackerNews/PostDetail'
import { PostsList } from '~/components/HackerNews/PostsList'
import { ListDetailView, SiteLayout } from '~/components/Layouts'
import { Detail } from '~/components/ListDetail/Detail'
import { withProviders } from '~/components/Providers/withProviders'

function HNPostPage({ id }) {
  const router = useRouter()

  if (router.isFallback) {
    return <Detail.Loading />
  }

  return <PostDetail id={id} />
}

export async function getServerSideProps({ params: { id } }) {
  return {
    props: {
      id,
    },
  }
}

HNPostPage.getLayout = withProviders(function getLayout(page) {
  return (
    <SiteLayout>
      <ListDetailView list={<PostsList />} hasDetail detail={page} />
    </SiteLayout>
  )
})

export default HNPostPage
