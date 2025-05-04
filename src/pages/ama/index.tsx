import { NextSeo } from 'next-seo'
import * as React from 'react'

import { QuestionsList } from '~/components/AMA/QuestionsList'
import { ListDetailView, SiteLayout } from '~/components/Layouts'
import { withProviders } from '~/components/Providers/withProviders'
import routes from '~/config/routes'

function AmaPage() {
  return (
    <NextSeo
      title={routes.ama.seo.title}
      description={routes.ama.seo.description}
      openGraph={routes.ama.seo.openGraph}
    />
  )
}

AmaPage.getLayout = withProviders(function getLayout(page) {
  return (
    <SiteLayout>
      <ListDetailView
        list={<QuestionsList />}
        hasDetail={false}
        detail={page}
      />
    </SiteLayout>
  )
})

export default AmaPage
