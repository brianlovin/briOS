import * as React from 'react'
import { ListDetailView } from '~/components/Layouts'
import { UserSettings } from '~/components/UserSettings'

export default function Home() {
  return <ListDetailView list={null} hasDetail detail={<UserSettings />} />
}
