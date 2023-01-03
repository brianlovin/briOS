import * as React from 'react'

import { ListDetailView, SiteLayout } from '~/components/Layouts'
import { withProviders } from '~/components/Providers/withProviders'
import { StackDetail } from '~/components/Stack/StackDetail'
import { StackList } from '~/components/Stack/StackList'

function StackDetailPage({ slug }) {
  return <StackDetail slug={slug} />
}

export async function getServerSideProps({ params: { slug } }) {
  return {
    props: {
      slug,
    },
  }
}

StackDetailPage.getLayout = withProviders(function getLayout(page) {
  return (
    <SiteLayout>
      <ListDetailView list={<StackList />} hasDetail detail={page} />
    </SiteLayout>
  )
})

export default StackDetailPage
