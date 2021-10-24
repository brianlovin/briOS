import { useRouter } from 'next/router'
import * as React from 'react'
import { Radio } from 'react-feather'

import Button from '~/components/Button'
import { DialogComponent } from '~/components/Dialog'
import { HNSubscribeBox } from '~/components/HNSubscribe'
import { ListContainer } from '~/components/ListDetail/ListContainer'
import { ListItem } from '~/components/ListDetail/ListItem'
import { TitleBar } from '~/components/ListDetail/TitleBar'
import { HNPost } from '~/pages/hn'

interface Props {
  posts: HNPost[]
}

const PostList = React.memo(({ posts }: Props) => {
  const router = useRouter()
  let [scrollContainerRef, setScrollContainerRef] = React.useState(null)

  function handleClick(e, post) {
    if (e.metaKey) {
      e.preventDefault()
      e.stopPropagation()
      window.open(post.url, '_blank').focus()
    }
  }

  return (
    <ListContainer onRef={setScrollContainerRef}>
      <TitleBar
        scrollContainerRef={scrollContainerRef}
        trailingAccessory={
          <DialogComponent
            title="Subscribe"
            trigger={
              <Button size="small">
                <Radio size={16} />
                <span>Subscribe</span>
              </Button>
            }
            modalContent={() => <HNSubscribeBox />}
          />
        }
        title="HN"
      />

      <div className="lg:p-3 lg:space-y-1">
        {posts.map((post) => {
          const active = router.query?.id === post.id.toString() // post ids are numbers

          return (
            <ListItem
              key={post.id}
              href="/hn/[id]"
              as={`/hn/${post.id}`}
              title={post.title}
              description={null}
              byline={post.domain}
              active={active}
              onClick={(e) => handleClick(e, post)}
            />
          )
        })}
      </div>
    </ListContainer>
  )
})

export default PostList
