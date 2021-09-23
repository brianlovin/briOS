import * as React from 'react'
import Image from 'next/image'
import { stackData } from './data'
import ListItem from '../ListDetail/ListItem'
import { useRouter } from 'next/router'
import ListContainer from '../ListDetail/ListContainer'
import TitleBar from '../ListDetail/TitleBar'
import { SmallButton } from '../Button'
import { Rss } from 'react-feather'

export const StackList = React.memo(() => {
  const router = useRouter()
  let [scrollContainerRef, setScrollContainerRef] = React.useState(null)

  return (
    <ListContainer onRef={setScrollContainerRef}>
      <TitleBar
        title="My Stack"
        scrollContainerRef={scrollContainerRef}
        trailingAccessory={
          <SmallButton>
            <Rss size={12} />
          </SmallButton>
        }
      />

      <div className="lg:p-3 lg:space-y-1">
        {stackData.map((stack) => {
          const active = router.query.slug === stack.slug
          return (
            <ListItem
              key={stack.name}
              href="/stack/[slug]"
              as={`/stack/${stack.slug}`}
              title={stack.name}
              description={null}
              byline={null}
              leadingAccessory={
                <Image
                  src={`/static/img/stack/${stack.image}`}
                  width={48}
                  height={48}
                  layout="fixed"
                  alt={`${stack.name} icon`}
                  className={'rounded-xl'}
                />
              }
              active={active}
            />
          )
        })}
      </div>
    </ListContainer>
  )
})
