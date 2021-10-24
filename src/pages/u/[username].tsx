import { NextSeo } from 'next-seo'
import * as React from 'react'
import { ListDetailView } from '~/components/Layouts'
import { UserDetail } from '~/components/User/UserDetail'
import routes from '~/config/routes'
import { getContext } from '~/graphql/context'
import { GET_USER } from '~/graphql/queries/user'
import { addApolloState, initApolloClient } from '~/lib/apollo'

export default function UserPage({ username }) {
  return (
    <>
      <NextSeo
        title={routes.security.seo.title}
        description={routes.security.seo.description}
        openGraph={routes.security.seo.openGraph}
      />

      <ListDetailView
        list={null}
        hasDetail
        detail={<UserDetail username={username} />}
      />
    </>
  )
}

export async function getServerSideProps({ params: { username }, req, res }) {
  const context = await getContext(req, res)
  const apolloClient = initApolloClient({ context })

  await apolloClient.query({
    query: GET_USER,
    variables: { username },
  })

  return addApolloState(apolloClient, {
    props: {
      username,
    },
  })
}
