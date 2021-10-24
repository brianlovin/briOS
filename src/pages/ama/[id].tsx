import * as React from 'react'
import { GET_QUESTIONS, GET_QUESTION } from '~/graphql/queries/questions'
import { ListDetailView, SiteLayout } from '~/components/Layouts'
import { addApolloState, initApolloClient } from '~/lib/apollo'
import { withProviders } from '~/components/Providers/withProviders'
import { CommentType } from '~/graphql/types.generated'
import { QuestionsList } from '~/components/AMA/QuestionsList'
import { QuestionDetail } from '~/components/AMA/QuestionDetail'
import { GET_COMMENTS } from '~/graphql/queries/comments'
import { getContext } from '~/graphql/context'

function QuestionDetailPage({ id }) {
  return <QuestionDetail id={id} />
}

export async function getServerSideProps({ params: { id }, req, res }) {
  const context = await getContext(req, res)
  const apolloClient = initApolloClient({ context })

  await Promise.all([
    apolloClient.query({ query: GET_QUESTIONS }),

    apolloClient.query({
      query: GET_QUESTION,
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

QuestionDetailPage.getLayout = withProviders(function getLayout(page) {
  return (
    <SiteLayout>
      <ListDetailView list={<QuestionsList />} hasDetail detail={page} />
    </SiteLayout>
  )
})

export default QuestionDetailPage
