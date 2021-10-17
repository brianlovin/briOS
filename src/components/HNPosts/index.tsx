import * as React from 'react'
import { HNPost } from '~/pages/hn'
import ListItem from '../ListDetail/ListItem'
import { useRouter } from 'next/router'
import TitleBar from '../ListDetail/TitleBar'
import ListContainer from '../ListDetail/ListContainer'
import Button from '../Button'
import { Radio } from 'react-feather'
import DialogComponent from '../Dialog'
import HNSubscribeBox from '../HNSubscribe'

interface Props {
  posts: HNPost[]
}

const PostList = React.memo(({ posts }: Props) => {
  const router = useRouter()
  let [scrollContainerRef, setScrollContainerRef] = React.useState(null)

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
              byline={`${post.comments_count} comments`}
              active={active}
            />
          )
        })}
      </div>
    </ListContainer>
  )
})

export default PostList
