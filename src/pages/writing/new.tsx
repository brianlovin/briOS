import * as React from 'react'

import { ListDetailView, SiteLayout } from '~/components/Layouts'
import { withProviders } from '~/components/Providers/withProviders'
import { PostEditor } from '~/components/Writing/Editor/PostEditor'
import { getContext } from '~/graphql/context'
import { addApolloState, initApolloClient } from '~/lib/apollo'

function NewPostPage() {
  return <PostEditor />
}

export async function getServerSideProps({ req, res }) {
  const context = await getContext(req, res)
  const apolloClient = initApolloClient({ context })

  return addApolloState(apolloClient, {
    props: {},
  })
}

NewPostPage.getLayout = withProviders(function getLayout(page) {
  return (
    <SiteLayout>
      <ListDetailView list={null} hasDetail detail={page} />
    </SiteLayout>
  )
})

export default NewPostPage
