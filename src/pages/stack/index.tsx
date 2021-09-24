import * as React from 'react'
import { NextSeo } from 'next-seo'
import { StackList } from '~/components/Stack/StackList'
import routes from '~/config/routes'
import { ListDetailView, SiteLayout } from '~/components/Layouts'
import { withProviders } from '~/components/Providers/withProviders'

function StackPage() {
  return (
    <>
      <NextSeo
        title={routes.stack.seo.title}
        description={routes.stack.seo.description}
        openGraph={routes.stack.seo.openGraph}
      />
    </>
  )
}

StackPage.getLayout = withProviders(function getLayout(page) {
  return (
    <SiteLayout>
      <ListDetailView list={<StackList />} hasDetail={false} detail={page} />
    </SiteLayout>
  )
})

export default StackPage
