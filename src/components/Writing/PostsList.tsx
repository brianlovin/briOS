import { useRouter } from 'next/router'
import * as React from 'react'

import { ListContainer } from '~/components/ListDetail/ListContainer'
import { useGetPostsQuery } from '~/graphql/types.generated'

import { LoadingSpinner } from '../LoadingSpinner'
import { PostListItem } from './PostListItem'
import { WritingTitlebar } from './WritingTitlebar'

export const WritingContext = React.createContext({
  filter: 'published',
  setFilter: (filter: string) => {},
})

export function PostsList() {
  const router = useRouter()
  const [filter, setFilter] = React.useState('published')
  let [scrollContainerRef, setScrollContainerRef] = React.useState(null)

  const variables =
    filter === 'published'
      ? { filter: { published: true } }
      : { filter: { published: false } }

  const { data, error, loading, refetch } = useGetPostsQuery({ variables })

  React.useEffect(() => {
    refetch()
  }, [filter])

  if (error) {
    return (
      <ListContainer onRef={setScrollContainerRef}>
        <div />
      </ListContainer>
    )
  }

  if (loading && !data?.posts) {
    return (
      <ListContainer onRef={setScrollContainerRef}>
        <WritingTitlebar scrollContainerRef={scrollContainerRef} />
        <div className="flex items-center justify-center flex-1">
          <LoadingSpinner />
        </div>
      </ListContainer>
    )
  }

  const { posts } = data

  const defaultContextValue = {
    filter,
    setFilter,
  }

  return (
    <WritingContext.Provider value={defaultContextValue}>
      <ListContainer data-cy="posts-list" onRef={setScrollContainerRef}>
        <WritingTitlebar scrollContainerRef={scrollContainerRef} />

        <div className="lg:p-3 lg:space-y-1">
          {posts.map((post) => {
            const active = router.query?.slug === post.slug

            return <PostListItem key={post.id} post={post} active={active} />
          })}
        </div>
      </ListContainer>
    </WritingContext.Provider>
  )
}
