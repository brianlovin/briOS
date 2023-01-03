import { NextSeo } from 'next-seo'
import * as React from 'react'

import { QuestionsList } from '~/components/AMA/QuestionsList'
import { ListDetailView, SiteLayout } from '~/components/Layouts'
import { withProviders } from '~/components/Providers/withProviders'
import routes from '~/config/routes'
import { getContext } from '~/graphql/context'
import { GET_QUESTIONS } from '~/graphql/queries/questions'
import { GET_VIEWER } from '~/graphql/queries/viewer'
import { QuestionStatus } from '~/graphql/types.generated'
import { addApolloState, initApolloClient } from '~/lib/apollo'

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
