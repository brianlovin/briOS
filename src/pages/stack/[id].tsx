import * as React from 'react'
import { NextSeo } from 'next-seo'
import routes from '~/config/routes'
import { ListDetailView, SiteLayout } from '~/components/Layouts'
import { StackList } from '~/components/Stack/StackList'
import { StackDetail } from '~/components/Stack/StackDetail'
import { withProviders } from '~/components/Providers/withProviders'
import { getContext } from '~/graphql/context'
import { addApolloState, initApolloClient } from '~/lib/apollo'
import { GET_STACK, GET_STACKS } from '~/graphql/queries/stack'
import { GET_COMMENTS } from '~/graphql/queries/comments'
import { CommentType } from '~/graphql/types.generated'

function StackDetailPage({ id }) {
  return (
    <>
      <NextSeo
        title={routes.stack.seo.title}
        description={routes.stack.seo.description}
        openGraph={routes.stack.seo.openGraph}
      />

      <StackDetail id={id} />
    </>
  )
}

export async function getServerSideProps({ params: { id }, req, res }) {
  const context = await getContext(req, res)
  const apolloClient = initApolloClient({ context })

  await Promise.all([
    apolloClient.query({
      query: GET_STACKS,
    }),

    apolloClient.query({
      query: GET_STACK,
      variables: { id },
    }),

    apolloClient.query({
      query: GET_COMMENTS,
      variables: { refId: id, type: CommentType.Stack },
    }),
  ])

  return addApolloState(apolloClient, {
    props: {
      id,
    },
  })
}

StackDetailPage.getLayout = withProviders(function getLayout(page) {
  return (
    <SiteLayout>
      <ListDetailView list={<StackList />} hasDetail detail={page} />
    </SiteLayout>
  )
})

export default StackDetailPage
