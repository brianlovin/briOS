import * as React from 'react'
import TitleBar from '~/components/ListDetail/TitleBar'
import { Detail } from '../ListDetail/Detail'

export function StackDetail({ stack }) {
  const scrollContainerRef = React.useRef(null)
  const titleRef = React.useRef(null)

  return (
    <Detail.Container ref={scrollContainerRef}>
      <TitleBar
        backButton
        globalMenu={false}
        backButtonHref={'/stack'}
        magicTitle
        title={stack.name}
        titleRef={titleRef}
        scrollContainerRef={scrollContainerRef}
      />

      <Detail.ContentContainer>
        <Detail.Header>
          <Detail.Title ref={titleRef}>{stack.name}</Detail.Title>
        </Detail.Header>
      </Detail.ContentContainer>
    </Detail.Container>
  )
}
