import * as React from 'react'

import { ListDetailView, SiteLayout } from '~/components/Layouts'
import { Detail } from '~/components/ListDetail/Detail'
import { withProviders } from '~/components/Providers/withProviders'
import { PostEditor } from '~/components/Writing/Editor/PostEditor'
import { getContext } from '~/graphql/context'
import { UserRole, useViewerQuery } from '~/graphql/types.generated'
import { addApolloState, initApolloClient } from '~/lib/apollo'

function NewPostPage() {
  const { data } = useViewerQuery()
  if (!data?.viewer) return <Detail.Null />
  if (data.viewer.role !== UserRole.Admin) return <Detail.Null />
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
