import { NextSeo } from 'next-seo'
import * as React from 'react'
import { Link as LinkIcon } from 'react-feather'

import { PrimaryButton } from '~/components/Button'
import { Detail } from '~/components/ListDetail/Detail'
import { TitleBar } from '~/components/ListDetail/TitleBar'
import { baseUrl } from '~/config/seo'
import { HNPost as HNPostType } from '~/pages/hn'

import { Byline } from './Byline'
import { HNComments } from './Comments'

interface Props {
  post: HNPostType
}

export function HNPost(props: Props) {
  const { post } = props
  const { comments } = post

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

      <Detail.Container ref={scrollContainerRef}>
        <TitleBar
          backButtonHref="/hn"
          backButton
          globalMenu={false}
          magicTitle
          title={post.title}
          titleRef={titleRef}
          scrollContainerRef={scrollContainerRef}
        />

        <Detail.ContentContainer>
          <Detail.Header>
            <Detail.Title ref={titleRef}>{post.title}</Detail.Title>
            <Byline post={post} />
          </Detail.Header>

          {post.url && (
            <div className="mt-6">
              <PrimaryButton size="large" href={post.url}>
                <LinkIcon size={14} />
                <span>Visit</span>
              </PrimaryButton>
            </div>
          )}

          {post.content && (
            <div
              className={'prose lg:prose-lg'}
              style={{
                display: 'grid',
              }}
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          )}
        </Detail.ContentContainer>

        <HNComments comments={comments} />
      </Detail.Container>
    </React.Fragment>
  )
}
