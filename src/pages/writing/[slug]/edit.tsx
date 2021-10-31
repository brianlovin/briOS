import * as React from 'react'

import { ListDetailView, SiteLayout } from '~/components/Layouts'
import { withProviders } from '~/components/Providers/withProviders'
import { PostEditor } from '~/components/Writing/PostEditor'
import { getContext } from '~/graphql/context'
import { GET_POST } from '~/graphql/queries/posts'
import { addApolloState, initApolloClient } from '~/lib/apollo'

function EditPostPage({ slug }) {
  return <PostEditor slug={slug} />
}

export async function getServerSideProps({ params: { slug }, req, res }) {
  const context = await getContext(req, res)
  const apolloClient = initApolloClient({ context })

  await apolloClient.query({
    query: GET_POST,
    variables: { slug },
  })

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
