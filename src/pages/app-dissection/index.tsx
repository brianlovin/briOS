import { NextSeo } from 'next-seo'
import * as React from 'react'

import { AppDissectionList } from '~/components/AppDissection/AppDissectionList'
import { ListDetailView, SiteLayout } from '~/components/Layouts'
import { withProviders } from '~/components/Providers/withProviders'
import routes from '~/config/routes'

function AppDissectionsPage() {
  return (
    <NextSeo
      title={routes.appDissection.seo.title}
      description={routes.appDissection.seo.description}
      openGraph={routes.appDissection.seo.openGraph}
    />
  )
}

AppDissectionsPage.getLayout = withProviders(function getLayout(page) {
  return (
    <SiteLayout>
      <ListDetailView
        list={<AppDissectionList />}
        hasDetail={false}
        detail={page}
      />
    </SiteLayout>
  )
})

export default AppDissectionsPage
