import * as React from 'react'

import { ListDetailView } from '~/components/Layouts'
import { UserSettings } from '~/components/UserSettings'

export default function Settings() {
  return <ListDetailView list={null} hasDetail detail={<UserSettings />} />
}
