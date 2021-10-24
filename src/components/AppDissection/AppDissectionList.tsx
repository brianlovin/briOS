import * as React from 'react'
import Image from 'next/image'
import { ListItem } from '~/components/ListDetail/ListItem'
import { useRouter } from 'next/router'
import { TitleBar } from '~/components/ListDetail/TitleBar'
import { ListContainer } from '~/components/ListDetail/ListContainer'
import { summaries } from '~/data/appDissections'

export const AppDissectionList = React.memo(() => {
  const router = useRouter()
  let [scrollContainerRef, setScrollContainerRef] = React.useState(null)

  return (
    <ListContainer onRef={setScrollContainerRef}>
      <TitleBar
        scrollContainerRef={scrollContainerRef}
        title="App Dissection"
      />

      <div className="lg:p-3 lg:space-y-1">
        {summaries.map((summary) => {
          const active = router.query.slug === summary.slug
          const date = new Date(summary.createdAt).toLocaleDateString('en-us', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })
          return (
            <ListItem
              key={summary.slug}
              href="/app-dissection/[slug]"
              as={`/app-dissection/${summary.slug}`}
              title={summary.title}
              description={null}
              leadingAccessory={
                <Image
                  width={'48px'}
                  height={'48px'}
                  layout="fixed"
                  alt={summary.title}
                  className={'rounded-xl'}
                  src={`/static/img/app-dissection/${summary.slug}.jpeg`}
                />
              }
              byline={`${summary.detailsCount} details`}
              active={active}
            />
          )
        })}
      </div>
    </ListContainer>
  )
})
