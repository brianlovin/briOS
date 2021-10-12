import * as React from 'react'
import { useRouter } from 'next/router'
import ListItem from '~/components/ListDetail/ListItem'
import TitleBar from '~/components/ListDetail/TitleBar'
import ListContainer from '~/components/ListDetail/ListContainer'
import { useGetPostsQuery } from '~/graphql/types.generated'

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
    <ListContainer onRef={setScrollContainerRef}>
      <TitleBar title="Writing" scrollContainerRef={scrollContainerRef} />

      <div className="lg:p-3 lg:space-y-1">
        {posts.map((post) => {
          const date = new Date(post.published_at).toLocaleDateString('en-us', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })

          const active = router.query?.slug === post.slug

          return (
            <ListItem
              key={post.id}
              href="/writing/[slug]"
              as={`/writing/${post.slug}`}
              title={post.title}
              description={post.excerpt}
              byline={date}
              active={active}
            />
          )
        })}
      </div>
    </ListContainer>
  )
}
