import * as React from 'react'
import Image from 'next/image'
import ListItem from '../ListDetail/ListItem'
import { useRouter } from 'next/router'
import ListContainer from '../ListDetail/ListContainer'
import TitleBar from '../ListDetail/TitleBar'
import { useGetStacksQuery } from '~/graphql/types.generated'
import { StackTitlebar } from './StackTitlebar'

export const StackList = React.memo(() => {
  const router = useRouter()
  let [scrollContainerRef, setScrollContainerRef] = React.useState(null)

  const { data, loading } = useGetStacksQuery()

  if (loading) {
    return null
  }

  return (
    <ListContainer onRef={setScrollContainerRef}>
      <StackTitlebar scrollContainerRef={scrollContainerRef} />

      <div className="lg:p-3 lg:space-y-1">
        {data.stacks.map((stack) => {
          const active = router.query.id === stack.id
          return (
            <ListItem
              key={stack.name}
              href="/stack/[id]"
              as={`/stack/${stack.id}`}
              title={stack.name}
              description={null}
              byline={null}
              leadingAccessory={
                <Image
                  src={stack.image}
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
