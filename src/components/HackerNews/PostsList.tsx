import { useRouter } from 'next/router'
import * as React from 'react'
import { Radio } from 'react-feather'

import Button from '~/components/Button'
import { DialogComponent } from '~/components/Dialog'
import { HackerNewsSubscriptionForm } from '~/components/HackerNews/SubscriptionForm'
import { ListContainer } from '~/components/ListDetail/ListContainer'
import { TitleBar } from '~/components/ListDetail/TitleBar'
import { useGetHackerNewsPostsQuery } from '~/graphql/types.generated'
import { useWindowFocus } from '~/hooks/useWindowFocus'

import { PostsListItem } from './PostListItem'

export function PostsList() {
  const router = useRouter()
  let [scrollContainerRef, setScrollContainerRef] = React.useState(null)

  const { data, loading, refetch } = useGetHackerNewsPostsQuery()

  useWindowFocus({ onFocus: refetch })

  if (loading) return null

  const { hackerNewsPosts: posts } = data

  return (
    <ListContainer data-cy="posts-list" onRef={setScrollContainerRef}>
      <TitleBar
        scrollContainerRef={scrollContainerRef}
        trailingAccessory={
          <DialogComponent
            title="Daily digest"
            trigger={
              <Button data-cy="open-subscribe-hn-dialog" size="small">
                <Radio size={16} />
                <span>Subscribe</span>
              </Button>
            }
            modalContent={() => <HackerNewsSubscriptionForm />}
          />
        }
        title="Better HN"
      />

      <div className="lg:space-y-1 lg:p-3">
        {posts &&
          posts.length > 0 &&
          posts.map((post) => {
            const active = router.query?.id === post.id.toString() // post ids are numbers

            return <PostsListItem key={post.id} post={post} active={active} />
          })}
      </div>
    </ListContainer>
  )
}
