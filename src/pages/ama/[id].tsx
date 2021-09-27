import * as React from 'react'
import { GET_AMA_QUESTIONS, GET_AMA_QUESTION } from '~/graphql/queries'
import { ListDetailView, SiteLayout } from '~/components/Layouts'
import { addApolloState, initApolloClient } from '~/lib/apollo/client'
import { withProviders } from '~/components/Providers/withProviders'
import { AmaStatus } from '~/graphql/types.generated'
import { AMAQuestionsList } from '~/components/AMA/AmaQuestionsList'
import { AMADetail } from '~/components/AMA/AMADetail'

function AMAQuestionDetailPage({ id }) {
  return <AMADetail id={id} />
}

export async function getServerSideProps({ params: { id } }) {
  const apolloClient = initApolloClient({})

  await Promise.all([
    apolloClient.query({
      query: GET_AMA_QUESTIONS,
      variables: { status: AmaStatus.Answered },
    }),

    apolloClient.query({
      query: GET_AMA_QUESTION,
      variables: { id },
    }),
  ])

  return addApolloState(apolloClient, {
    props: {
      id,
    },
  })
}

AMAQuestionDetailPage.getLayout = withProviders(function getLayout(page) {
  return (
    <SiteLayout>
      <ListDetailView list={<AMAQuestionsList />} hasDetail detail={page} />
    </SiteLayout>
  )
})

export default AMAQuestionDetailPage
