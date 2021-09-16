import * as React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Post } from '~/graphql/types.generated'
import routes from '~/config/routes'
import SegmentedControl from '../SegmentedControl'
import { baseUrl } from '~/config/seo'

interface Props {
  posts: {
    recent: Post[]
    popular: Post[]
  }
}

export default function Writing({ posts }: Props) {
  function getFormattedDate(post) {
    return new Date(post.published_at).toLocaleDateString('en-us', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const segments = [
    { id: 'recent', label: 'Recent' },
    { id: 'popular', label: 'Popular' },
  ]

  const [activeSegment, setActiveSegment] = React.useState(segments[0].id)

  return (
    <div className="flex flex-col items-center justify-center pt-24 pb-0 bg-red-600 border-b border-gray-100">
      <div className="w-full max-w-screen-md mx-auto justify-content">
        <div className="space-y-3 text-center">
          <p className="text-5xl font-bold text-white">
            {routes.writing.label}
          </p>
          <p className="text-2xl font-medium text-white text-opacity-70">
            {routes.writing.seo.description}
          </p>
        </div>
        <div className="pt-8 pb-12">
          <SegmentedControl
            tint={{ light: 'bg-red-100', dark: 'bg-white' }}
            text={{ active: 'text-red-900', inactive: 'text-white' }}
            onSetActiveItem={(name) => setActiveSegment(name)}
            items={segments}
          />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-px bg-gray-100 papyrus">
        {posts[activeSegment]?.map((post) => {
          const date = getFormattedDate(post)

          return (
            <Link
              key={post.id}
              href="/writing/[slug]"
              as={`/writing/${post.slug}`}
            >
              <a className="bg-white min-w-min hover:bg-red-600 group">
                {/* <Image
                    src={
                      post.feature_image ||
                      `${baseUrl}/static/img/writing/${post.slug}.png`
                    }
                    width={1012}
                    height={506}
                    layout="responsive"
                    className="inline-flex"
                  /> */}
                <div className="flex flex-col h-full p-6">
                  <p className="text-2xl font-bold text-gray-1000 group-hover:text-white">
                    {post.title}
                  </p>
                  <p className="flex flex-col flex-1 pt-2 font-serif text-lg line-clamp-4 text-gray-1000 opacity-80 filter-saturate group-hover:text-white">
                    {post.excerpt}
                  </p>
                  <p className="pt-4 font-mono leading-none opacity-40 text-gray-1000 filter-saturate group-hover:text-white">
                    {date}
                  </p>
                </div>
              </a>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
