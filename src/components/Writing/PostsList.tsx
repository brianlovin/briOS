import { useRouter } from 'next/router'
import * as React from 'react'
import { Radio } from 'react-feather'

import { ListContainer } from '~/components/ListDetail/ListContainer'
import { TitleBar } from '~/components/ListDetail/TitleBar'
import { useGetPostsQuery } from '~/graphql/types.generated'

import Button from '../Button'
import { DialogComponent } from '../Dialog'
import { PostListItem } from './PostListItem'
import { WritingSubscriptionForm } from './SubscriptionForm'

export function PostsList() {
  const router = useRouter()
  let [scrollContainerRef, setScrollContainerRef] = React.useState(null)
  const { data, error, loading } = useGetPostsQuery()

  if (error || loading) {
    return (
      <ListContainer onRef={setScrollContainerRef}>
        <div />
      </ListContainer>
    )
  }

  const { posts } = data

  if (!posts || posts.length === 0) return null

  return (
    <ListContainer data-cy="posts-list" onRef={setScrollContainerRef}>
      <TitleBar
        trailingAccessory={
          <DialogComponent
            title="Newsletter"
            trigger={
              <Button data-cy="open-subscribe-hn-dialog" size="small">
                <Radio size={16} />
                <span>Subscribe</span>
              </Button>
            }
            modalContent={() => <WritingSubscriptionForm />}
          />
        }
        title="Writing"
        scrollContainerRef={scrollContainerRef}
      />

      <div className="lg:p-3 lg:space-y-1">
        {posts.map((post) => {
          const active = router.query?.slug === post.slug

          return <PostListItem key={post.id} post={post} active={active} />
        })}
      </div>
    </ListContainer>
  )
}
