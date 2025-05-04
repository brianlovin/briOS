import * as React from 'react'

import { TitleBar } from '~/components/ListDetail/TitleBar'

export function WritingTitlebar({ scrollContainerRef }) {
  return (
    <TitleBar
      title="Writing"
      scrollContainerRef={scrollContainerRef}
    ></TitleBar>
  )
}
