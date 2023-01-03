import * as React from 'react'

import { ListDetailView, SiteLayout } from '~/components/Layouts'
import { Detail } from '~/components/ListDetail/Detail'
import { withProviders } from '~/components/Providers/withProviders'
import { PostEditor } from '~/components/Writing/Editor/PostEditor'
import { useViewerQuery } from '~/graphql/types.generated'

function EditPostPage({ slug }) {
  const { data } = useViewerQuery()
  if (!data?.viewer?.isAdmin) return <Detail.Null />
  return <PostEditor slug={slug} />
}

export async function getServerSideProps({ params: { slug } }) {
  return {
    props: { slug },
  }
}

EditPostPage.getLayout = withProviders(function getLayout(page) {
  return (
    <SiteLayout>
      <ListDetailView list={null} hasDetail detail={page} />
    </SiteLayout>
  )
})

export default EditPostPage
