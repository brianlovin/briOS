import { NextSeo } from 'next-seo'
import * as React from 'react'

import { PostsList } from '~/components/HackerNews/PostsList'
import { ListDetailView, SiteLayout } from '~/components/Layouts'
import { withProviders } from '~/components/Providers/withProviders'
import routes from '~/config/routes'

function HNPage() {
  return (
    <NextSeo
      title={routes.hn.seo.title}
      description={routes.hn.seo.description}
      openGraph={routes.hn.seo.openGraph}
    />
  )
}

HNPage.getLayout = withProviders(function getLayout(page) {
  return (
    <SiteLayout>
      <ListDetailView list={<PostsList />} hasDetail={false} detail={page} />
    </SiteLayout>
  )
})

export default HNPage
