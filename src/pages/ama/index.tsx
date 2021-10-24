import * as React from 'react'
import { QuestionsList } from '~/components/AMA/QuestionsList'
import { NextSeo } from 'next-seo'
import routes from '~/config/routes'
import { withProviders } from '~/components/Providers/withProviders'
import { ListDetailView, SiteLayout } from '~/components/Layouts'
import { addApolloState, initApolloClient } from '~/lib/apollo'
import { GET_QUESTIONS } from '~/graphql/queries/questions'
import { getContext } from '~/graphql/context'

function AmaPage() {
  return (
    <>
      <NextSeo
        title={routes.ama.seo.title}
        description={routes.ama.seo.description}
        openGraph={routes.ama.seo.openGraph}
      />
    </>
  )
}

export async function getServerSideProps({ req, res }) {
  const context = await getContext(req, res)
  const apolloClient = initApolloClient({ context })

  await apolloClient.query({ query: GET_QUESTIONS })

  return addApolloState(apolloClient, {
    props: {},
  })
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
