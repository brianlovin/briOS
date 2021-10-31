import { NextSeo } from 'next-seo'
import * as React from 'react'

import { QuestionDetail } from '~/components/AMA/QuestionDetail'
import { QuestionsList } from '~/components/AMA/QuestionsList'
import { ListDetailView, SiteLayout } from '~/components/Layouts'
import { withProviders } from '~/components/Providers/withProviders'
import routes from '~/config/routes'
import { getContext } from '~/graphql/context'
import { GET_COMMENTS } from '~/graphql/queries/comments'
import { GET_QUESTION, GET_QUESTIONS } from '~/graphql/queries/questions'
import { CommentType, QuestionStatus } from '~/graphql/types.generated'
import { addApolloState, initApolloClient } from '~/lib/apollo'

function QuestionDetailPage({ id }) {
  return (
    <>
      <NextSeo
        title={routes.ama.seo.title}
        description={routes.ama.seo.description}
        openGraph={routes.ama.seo.openGraph}
      />
      <QuestionDetail id={id} />
    </>
  )
}

export async function getServerSideProps({ params: { id }, req, res }) {
  const context = await getContext(req, res)
  const apolloClient = initApolloClient({ context })

  await Promise.all([
    apolloClient.query({
      query: GET_QUESTIONS,
      variables: {
        filter: { status: QuestionStatus.Answered },
      },
    }),

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
