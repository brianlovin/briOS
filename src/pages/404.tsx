import * as React from 'react'

import Button from '~/components/Button'
import { ListDetailView } from '~/components/Layouts'
import { Detail } from '~/components/ListDetail/Detail'

function MissingPage() {
  return (
    <Detail.Container>
      <Detail.ContentContainer>
        <Detail.Header>
          <Detail.Title>Page not found. What’s up with that?</Detail.Title>

          <Button href="/">Return home</Button>
        </Detail.Header>
      </Detail.ContentContainer>
    </Detail.Container>
  )
}

export default function Home() {
  return <ListDetailView list={null} hasDetail detail={<MissingPage />} />
}
