import * as React from 'react'
import { Post } from '~/graphql/types.generated'
import { useRouter } from 'next/router'
import ListItem from '~/components/ListDetail/ListItem'
import TitleBar from '~/components/ListDetail/TitleBar'
import ListContainer from '~/components/ListDetail/ListContainer'

interface Props {
  posts: Post[]
}

export default function PostsList({ posts }: Props) {
  if (!posts || posts.length === 0) return null

  const router = useRouter()

  return (
    <ListContainer>
      <TitleBar title="Writing" />

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
