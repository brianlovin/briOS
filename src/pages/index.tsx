import * as React from 'react'
import Intro from '~/components/Home/Intro'
import { DetailViewOnly } from '~/components/Layouts'

export default function Home() {
  return (
    <DetailViewOnly>
      <Intro />
    </DetailViewOnly>
  )
}
