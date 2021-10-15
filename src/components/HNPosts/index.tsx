import * as React from 'react'
import { HNPost } from '~/pages/hn'
import ListItem from '../ListDetail/ListItem'
import { useRouter } from 'next/router'
import { format } from 'timeago.js'
import TitleBar from '../ListDetail/TitleBar'
import ListContainer from '../ListDetail/ListContainer'

interface Props {
  posts: HNPost[]
}

const PostList = React.memo(({ posts }: Props) => {
  const router = useRouter()
  let [scrollContainerRef, setScrollContainerRef] = React.useState(null)

  return (
    <ListContainer onRef={setScrollContainerRef}>
      <TitleBar scrollContainerRef={scrollContainerRef} title="Hacker News" />

      <div className="lg:p-3 lg:space-y-1">
        {posts.map((post) => {
          const active = router.query?.id === post.id.toString() // post ids are numbers
          const [timeAgo, setTimeAgo] = React.useState(format(post.time * 1000))

          React.useEffect(() => {
            setTimeAgo(format(post.time * 1000))
          }, [])

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
