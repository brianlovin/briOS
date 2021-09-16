import * as React from 'react'
import { Post } from '~/graphql/types.generated'
import SyntaxHighlighter from '~/components/SyntaxHighlighter'
import SEO from './SEO'
import Link from 'next/link'
import { ArrowLeft, Maximize2, X } from 'react-feather'
import { GlobalNavigationContext } from '~/components/Providers'
import TitleBar from '~/components/ListDetail/TitleBar'

interface Props {
  post: Post
}

export default function PostView({ post }: Props) {
  const date = new Date(post.published_at).toLocaleDateString('en-us', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const scrollContainerRef = React.useRef(null)
  const titleRef = React.useRef(null)

  return (
    <React.Fragment>
      <SyntaxHighlighter data={post} />
      <SEO post={post} />
      <div
        ref={scrollContainerRef}
        className="w-full max-h-screen overflow-y-auto bg-white dark:bg-black"
      >
        <TitleBar
          backButton
          globalMenu={false}
          backButtonHref={'/writing'}
          magicTitle
          title={post.title}
          titleRef={titleRef}
          scrollContainerRef={scrollContainerRef}
        />

        <div className="max-w-3xl px-4 py-8 mx-auto md:px-8 xl:py-16">
          <div data-cy="post" className="space-y-8">
            <div className="space-y-4">
              <h1
                ref={titleRef}
                className="font-sans text-2xl font-bold md:text-3xl text-primary"
              >
                {post.title}
              </h1>
              <span className="inline-block leading-snug text-tertiary">
                {date}
              </span>
            </div>
          </div>

          <div
            className="mt-8 prose lg:prose-lg"
            dangerouslySetInnerHTML={{ __html: post.html }}
          />
        </div>
      </div>
    </React.Fragment>
  )
}
