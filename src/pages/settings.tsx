import * as React from 'react'
import { ListDetailView } from '~/components/Layouts'
import { UserSettings } from '~/components/UserSettings'
import { getContext } from '~/graphql/context'
import { GET_VIEWER_SETTINGS } from '~/graphql/queries/viewer'
import { addApolloState, initApolloClient } from '~/lib/apollo/client'

export default function Settings() {
  return <ListDetailView list={null} hasDetail detail={<UserSettings />} />
}

export async function getServerSideProps({ req, res }) {
  const context = await getContext(req, res)
  const apolloClient = initApolloClient({ context })

  await apolloClient.query({
    query: GET_VIEWER_SETTINGS,
  })

  return addApolloState(apolloClient, { props: {} })
}
