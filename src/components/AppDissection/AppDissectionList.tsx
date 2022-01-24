import { useRouter } from 'next/router'
import * as React from 'react'

import { ListContainer } from '~/components/ListDetail/ListContainer'
import { TitleBar } from '~/components/ListDetail/TitleBar'
import { summaries } from '~/data/appDissections'

import { AppDissectionListItem } from './AppDissectionListItem'

export const AppDissectionList = React.memo(() => {
  const router = useRouter()
  let [scrollContainerRef, setScrollContainerRef] = React.useState(null)

  return (
    <ListContainer data-cy="apps-list" onRef={setScrollContainerRef}>
      <TitleBar
        scrollContainerRef={scrollContainerRef}
        title="App Dissection"
      />

      <div className="lg:space-y-1 lg:p-3">
        {summaries.map((summary) => {
          const active = router.query.slug === summary.slug
          return (
            <AppDissectionListItem
              key={summary.slug}
              summary={summary}
              active={active}
            />
          )
        })}
      </div>
    </ListContainer>
  )
})
