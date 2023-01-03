import * as React from 'react'

import { ListDetailView } from '~/components/Layouts'
import { UserDetail } from '~/components/UserProfile/UserDetail'

export default function UserPage({ username }) {
  return (
    <ListDetailView
      list={null}
      hasDetail
      detail={<UserDetail username={username} />}
    />
  )
}

export async function getServerSideProps({ params: { username } }) {
  return {
    props: {
      username,
    },
  }
}
