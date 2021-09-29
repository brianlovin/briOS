import * as React from 'react'
import { GET_AMA_QUESTIONS, GET_AMA_QUESTION } from '~/graphql/queries'
import { ListDetailView, SiteLayout } from '~/components/Layouts'
import { addApolloState, initApolloClient } from '~/lib/apollo/client'
import { withProviders } from '~/components/Providers/withProviders'
import { AmaStatus, CommentType } from '~/graphql/types.generated'
import { AMAQuestionsList } from '~/components/AMA/QuestionsList'
import { AMADetail } from '~/components/AMA/AMADetail'
import { GET_COMMENTS } from '~/graphql/queries/comments'

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

    apolloClient.query({
      query: GET_COMMENTS,
      variables: { refId: id, type: CommentType.Question },
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
      <ListDetailView
        list={<AMAQuestionsList status={AmaStatus.Answered} />}
        hasDetail
        detail={page}
      />
    </SiteLayout>
  )
})

export default AMAQuestionDetailPage
