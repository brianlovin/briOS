import * as React from 'react'
import SyntaxHighlighter from '~/components/SyntaxHighlighter'
import TitleBar from '~/components/ListDetail/TitleBar'
import { useGetPostQuery } from '~/graphql/types.generated'
import { MarkdownRenderer } from '../MarkdownRenderer'
import DesignDetailMedia from '../DesignDetailMedia'

export function AppDissectionDetail({ post }) {
  const scrollContainerRef = React.useRef(null)
  const titleRef = React.useRef(null)

  const date = new Date(post.createdAt).toLocaleDateString('en-us', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })

  return (
    <React.Fragment>
      <div
        ref={scrollContainerRef}
        className="w-full max-h-screen overflow-y-auto bg-white dark:bg-black"
      >
        <TitleBar
          backButton
          globalMenu={false}
          backButtonHref={'/app-dissection'}
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

          <div className="space-y-12">
            <div className="pt-12 prose">
              <MarkdownRenderer>{post.description}</MarkdownRenderer>
            </div>

            {post.details.map((detail, i) => (
              <DesignDetailMedia detail={detail} key={`${detail.title}-${i}`} />
            ))}
          </div>
        </div>
      </div>
    </React.Fragment>
  )
}
