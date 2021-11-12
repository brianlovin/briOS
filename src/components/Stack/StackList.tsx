import { useRouter } from 'next/router'
import * as React from 'react'

import { ListContainer } from '~/components/ListDetail/ListContainer'
import { useGetStacksQuery } from '~/graphql/types.generated'

import { ListLoadMore } from '../ListDetail/ListLoadMore'
import { LoadingSpinner } from '../LoadingSpinner'
import { StackListItem } from './StackListItem'
import { StackTitlebar } from './StackTitlebar'

export function StackList() {
  const router = useRouter()
  const [isVisible, setIsVisible] = React.useState(false)
  let [scrollContainerRef, setScrollContainerRef] = React.useState(null)

  const { data, loading, fetchMore } = useGetStacksQuery()

  function handleFetchMore() {
    return fetchMore({
      variables: {
        after: data.stacks.pageInfo.endCursor,
      },
    })
  }

  React.useEffect(() => {
    if (isVisible) handleFetchMore()
  }, [isVisible])

  if (loading && !data?.stacks) {
    return (
      <ListContainer onRef={setScrollContainerRef}>
        <StackTitlebar scrollContainerRef={scrollContainerRef} />
        <div className="flex items-center justify-center flex-1">
          <LoadingSpinner />
        </div>
      </ListContainer>
    )
  }

  return (
    <ListContainer data-cy="stack-list" onRef={setScrollContainerRef}>
      <StackTitlebar scrollContainerRef={scrollContainerRef} />

      <div className="lg:p-3 lg:space-y-1">
        {data.stacks.edges.map((stack) => {
          const active = router.query.slug === stack.node.slug
          return (
            <StackListItem
              key={stack.node.id}
              stack={stack.node}
              active={active}
            />
          )
        })}

        {data.stacks.pageInfo.hasNextPage && (
          <ListLoadMore setIsVisible={setIsVisible} />
        )}
      </div>
    </ListContainer>
  )
}
