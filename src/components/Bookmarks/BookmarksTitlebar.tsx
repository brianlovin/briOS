import * as React from 'react'

import { TitleBar } from '~/components/ListDetail/TitleBar'

export function BookmarksTitlebar({ scrollContainerRef }) {
  return <TitleBar scrollContainerRef={scrollContainerRef} title="Bookmarks" />
}
