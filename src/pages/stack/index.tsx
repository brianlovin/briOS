import { NextSeo } from 'next-seo'
import * as React from 'react'

import { ListDetailView, SiteLayout } from '~/components/Layouts'
import { withProviders } from '~/components/Providers/withProviders'
import { StackList } from '~/components/Stack/StackList'
import routes from '~/config/routes'
import { getContext } from '~/graphql/context'
import { GET_STACKS } from '~/graphql/queries/stack'
import { addApolloState, initApolloClient } from '~/lib/apollo'

function StackPage() {
  return (
    <>
      <NextSeo
        title={routes.stack.seo.title}
        description={routes.stack.seo.description}
        openGraph={routes.stack.seo.openGraph}
      />
    </>
  )
}

StackPage.getLayout = withProviders(function getLayout(page) {
  return (
    <SiteLayout>
      <ListDetailView list={<StackList />} hasDetail={false} detail={page} />
    </SiteLayout>
  )
})

export async function getServerSideProps({ req, res }) {
  const context = await getContext(req, res)
  const apolloClient = initApolloClient({ context })

  await apolloClient.query({
    query: GET_STACKS,
  })

  return addApolloState(apolloClient, {
    props: {},
  })
}

export default StackPage
