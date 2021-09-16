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

const PostList = React.memo((props: Props) => {
  const { posts } = props
  const router = useRouter()

  return (
    <ListContainer>
      <TitleBar title="Hacker News" />

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
              byline={
                <span className="flex space-x-2">
                  <p>{post.comments_count} comments</p>
                  <p>·</p>
                  <p>{timeAgo}</p>
                </span>
              }
              active={active}
            />
          )
        })}
      </div>
    </ListContainer>
  )
})

export default PostList
