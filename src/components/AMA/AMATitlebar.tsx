import * as React from 'react'

import { TitleBar } from '~/components/ListDetail/TitleBar'

export function AMATitlebar({ scrollContainerRef }) {
  return (
    <TitleBar
      scrollContainerRef={scrollContainerRef}
      title="Ask me anything"
      trailingAccessory={null}
    ></TitleBar>
  )
}
