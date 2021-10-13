import * as React from 'react'
import { AMAQuestionsList } from '~/components/AMA/QuestionsList'
import { NextSeo } from 'next-seo'
import routes from '~/config/routes'
import { withProviders } from '~/components/Providers/withProviders'
import { ListDetailView, SiteLayout } from '~/components/Layouts'
import { addApolloState, initApolloClient } from '~/lib/apollo/client'
import { GET_AMA_QUESTIONS } from '~/graphql/queries'
import { AmaStatus } from '~/graphql/types.generated'
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

  await apolloClient.query({
    query: GET_AMA_QUESTIONS,
    variables: { status: AmaStatus.Answered },
  })

  return addApolloState(apolloClient, {
    props: {},
  })
}

AmaPage.getLayout = withProviders(function getLayout(page) {
  return (
    <SiteLayout>
      <ListDetailView
        list={<AMAQuestionsList status={AmaStatus.Answered} />}
        hasDetail={false}
        detail={page}
      />
    </SiteLayout>
  )
})

export default AmaPage