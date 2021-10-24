import * as React from 'react'

import { Intro } from '~/components/Home/Intro'
import { ListDetailView } from '~/components/Layouts'

export default function Home() {
  return <ListDetailView list={null} hasDetail detail={<Intro />} />
}
