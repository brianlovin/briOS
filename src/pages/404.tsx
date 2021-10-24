import * as React from 'react'

import { PrimaryButton } from '~/components/Button'
import { ListDetailView } from '~/components/Layouts'
import { Detail } from '~/components/ListDetail/Detail'
import { TitleBar } from '~/components/ListDetail/TitleBar'

function MissingPage() {
  return (
    <Detail.Container>
      <TitleBar title="" />
      <Detail.ContentContainer>
        <Detail.Header>
          <Detail.Title>404</Detail.Title>
          <div className="flex">
            <PrimaryButton size="large" href="/">
              Return home
            </PrimaryButton>
          </div>
        </Detail.Header>
      </Detail.ContentContainer>
    </Detail.Container>
  )
}

export default function Home() {
  return <ListDetailView list={null} hasDetail detail={<MissingPage />} />
}
