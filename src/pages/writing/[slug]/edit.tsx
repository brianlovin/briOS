import * as React from 'react'

import { ListDetailView, SiteLayout } from '~/components/Layouts'
import { Detail } from '~/components/ListDetail/Detail'
import { withProviders } from '~/components/Providers/withProviders'
import { PostEditor } from '~/components/Writing/Editor/PostEditor'
import { getContext } from '~/graphql/context'
import { GET_POST } from '~/graphql/queries/posts'
import { GET_VIEWER } from '~/graphql/queries/viewer'
import { useViewerQuery } from '~/graphql/types.generated'
import { addApolloState, initApolloClient } from '~/lib/apollo'

function EditPostPage({ slug }) {
  const { data } = useViewerQuery()
  if (!data?.viewer?.isAdmin) return <Detail.Null />
  return <PostEditor slug={slug} />
}

export async function getServerSideProps({ params: { slug }, req, res }) {
  const context = await getContext(req, res)
  const apolloClient = initApolloClient({ context })

  await Promise.all([
    apolloClient.query({ query: GET_VIEWER }),

    apolloClient.query({
      query: GET_POST,
      variables: { slug },
    }),
  ])

  return addApolloState(apolloClient, {
    props: { slug },
  })
}

EditPostPage.getLayout = withProviders(function getLayout(page) {
  return (
    <SiteLayout>
      <ListDetailView list={null} hasDetail detail={page} />
    </SiteLayout>
  )
})

export default EditPostPage
