import * as React from 'react'
import Link from 'next/link'
import { NextSeo } from 'next-seo'
import { Comment } from './Comment'
import Byline from './Byline'
import { HNPost as HNPostType } from '~/pages/hn'
import HNSubscribeBox from '../HNSubscribe'
import { baseUrl } from '~/config/seo'
import { ArrowLeft } from 'react-feather'
import TitleBar from '../ListDetail/TitleBar'

interface Props {
  post: HNPostType
}

export function HNPost(props: Props) {
  const { post } = props

  // trim things down to a readable amount
  const comments = post.comments.slice(0, 8)

  const scrollContainerRef = React.useRef(null)
  const titleRef = React.useRef(null)

  return (
    <React.Fragment>
      <NextSeo
        title={post.title}
        description={
          post.content || `${post.comments_count} comments · ${post.domain}`
        }
        openGraph={{
          title: post.title,
          url: `${baseUrl}/hn/${post.id}`,
          description:
            post.content || `${post.comments_count} comments · ${post.domain}`,
          site_name: 'Hacker News',
        }}
        twitter={{
          cardType: 'summary_large_image',
        }}
      />

      <div
        ref={scrollContainerRef}
        className="w-full max-h-screen overflow-y-auto bg-white dark:bg-black"
      >
        <TitleBar
          backButtonHref="/hn"
          backButton
          globalMenu={false}
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
              <Byline post={post} />
            </div>
            {post.content && (
              <div
                className={'prose lg:prose-lg'}
                style={{
                  display: 'grid',
                }}
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            )}
            {comments.map((comment) => (
              <Comment key={comment.id} comment={comment} />
            ))}
          </div>
        </div>
      </div>
    </React.Fragment>
  )
}
