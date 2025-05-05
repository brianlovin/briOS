import * as React from 'react'

import { TitleBar } from '~/components/ListDetail/TitleBar'

export function StackTitlebar({ scrollContainerRef }) {
  return (
    <TitleBar
      scrollContainerRef={scrollContainerRef}
      title="Stack"
      trailingAccessory={null}
    />
  )
}
