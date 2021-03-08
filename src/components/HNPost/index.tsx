import * as React from 'react'
import Link from 'next/link'
import { NextSeo } from 'next-seo'
import { Comment } from './Comment'
import Divider from '../Divider'
import { CenteredColumn } from '../Layouts'
import Byline from './Byline'
import { HNPost as HNPostType } from '~/pages/hn'
import HNSubscribeBox from '../HNSubscribe'
import { baseUrl } from '~/config/seo'

interface Props {
  post: HNPostType
}

export function HNPost(props: Props) {
  const { post } = props

  // trim things down to a readable amount
  const comments = post.comments.slice(0, 8)

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
      <CenteredColumn data-cy="bookmarks">
        <div className="space-y-8 ">
          <div className="space-y-4">
            <Link href="/hn" passHref>
              <a className="text-tertiary hover:text-gray-1000 dark:hover:text-gray-100">
                &larr; Back
              </a>
            </Link>

            <a
              className="block"
              href={post.url}
              target="blank"
              rel="noopener noreferrer"
            >
              <h1 className="font-sans text-4xl font-black text-primary">
                {post.title}
              </h1>
            </a>

            <Byline post={post} />
            {post.content && (
              <div
                className={'prose lg:prose-lg'}
                style={{
                  display: 'grid',
                }}
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            )}
          </div>

          <div>
            {comments.map((comment) => (
              <Comment key={comment.id} comment={comment} />
            ))}
          </div>

          <HNSubscribeBox />
        </div>
      </CenteredColumn>
    </React.Fragment>
  )
}
