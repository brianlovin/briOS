import { useRouter } from 'next/router'
import * as React from 'react'
import { Radio } from 'react-feather'

import Button from '~/components/Button'
import { DialogComponent } from '~/components/Dialog'
import { SubscriptionForm } from '~/components/HackerNews/SubscriptionForm'
import { ListContainer } from '~/components/ListDetail/ListContainer'
import { TitleBar } from '~/components/ListDetail/TitleBar'
import { HNPost } from '~/pages/hn'

import { PostsListItem } from './PostListItem'

interface Props {
  posts: HNPost[]
}

export const PostsList = React.memo<Props>(({ posts }) => {
  const router = useRouter()
  let [scrollContainerRef, setScrollContainerRef] = React.useState(null)

  return (
    <ListContainer data-cy="posts-list" onRef={setScrollContainerRef}>
      <TitleBar
        scrollContainerRef={scrollContainerRef}
        trailingAccessory={
          <DialogComponent
            title="Subscribe"
            trigger={
              <Button data-cy="open-subscribe-hn-dialog" size="small">
                <Radio size={16} />
                <span>Subscribe</span>
              </Button>
            }
            modalContent={() => <SubscriptionForm />}
          />
        }
        title="HN"
      />

      <div className="lg:p-3 lg:space-y-1">
        {posts.map((post) => {
          const active = router.query?.id === post.id.toString() // post ids are numbers

          return <PostsListItem key={post.id} post={post} active={active} />
        })}
      </div>
    </ListContainer>
  )
})
