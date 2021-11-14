import * as React from 'react'

import { ListDetailView } from '~/components/Layouts'
import { UserDetail } from '~/components/UserProfile/UserDetail'
import { getContext } from '~/graphql/context'
import { GET_USER } from '~/graphql/queries/user'
import { GET_VIEWER } from '~/graphql/queries/viewer'
import { addApolloState, initApolloClient } from '~/lib/apollo'

export default function UserPage({ username }) {
  return (
    <ListDetailView
      list={null}
      hasDetail
      detail={<UserDetail username={username} />}
    />
  )
}

export async function getServerSideProps({ params: { username }, req, res }) {
  const context = await getContext(req, res)
  const apolloClient = initApolloClient({ context })

  await Promise.all([
    apolloClient.query({ query: GET_VIEWER }),

    apolloClient.query({
      query: GET_USER,
      variables: { username },
    }),
  ])

  return addApolloState(apolloClient, {
    props: {
      username,
    },
  })
}
