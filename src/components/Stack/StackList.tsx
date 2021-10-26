import { useRouter } from 'next/router'
import * as React from 'react'

import { ListContainer } from '~/components/ListDetail/ListContainer'
import { useGetStacksQuery } from '~/graphql/types.generated'

import { StackListItem } from './StackListItem'
import { StackTitlebar } from './StackTitlebar'

export function StackList() {
  const router = useRouter()
  let [scrollContainerRef, setScrollContainerRef] = React.useState(null)

  const { data, loading } = useGetStacksQuery()

  if (loading) {
    return null
  }

  return (
    <ListContainer data-cy="stack-list" onRef={setScrollContainerRef}>
      <StackTitlebar scrollContainerRef={scrollContainerRef} />

      <div className="lg:p-3 lg:space-y-1">
        {data.stacks.map((stack) => {
          const active = router.query.id === stack.id
          return <StackListItem key={stack.id} stack={stack} active={active} />
        })}
      </div>
    </ListContainer>
  )
}
