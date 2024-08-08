import Link from 'next/link'
import { NextSeo } from 'next-seo'
import * as React from 'react'
import { Link as LinkIcon } from 'react-feather'

import { PrimaryButton } from '~/components/Button'
import { Campsite } from '~/components/Campsite'
import { Comments } from '~/components/Comments'
import { Detail } from '~/components/ListDetail/Detail'
import { TitleBar } from '~/components/ListDetail/TitleBar'
import { Tags } from '~/components/Tag'
import routes from '~/config/routes'
import { CommentType, useGetBookmarkQuery } from '~/graphql/types.generated'

import { MarkdownRenderer } from '../MarkdownRenderer'
import { BookmarkActions } from './BookmarkActions'
import { RelatedBookmarks } from './RelatedBookmarks'

export function BookmarkDetail({ id }) {
  const scrollContainerRef: React.RefObject<HTMLDivElement> = React.useRef(null)
  const titleRef: React.RefObject<HTMLHeadingElement> = React.useRef(null)
  const { data, loading, error } = useGetBookmarkQuery({
    variables: { id },
  })

  if (loading) {
    return <Detail.Loading />
  }

  if (!data?.bookmark || error) {
    return <Detail.Null />
  }

  const { bookmark } = data

  return (
    <>
      <NextSeo
        title={bookmark.title}
        description={bookmark.description}
        openGraph={{
          title: bookmark.title,
          description: bookmark.description,
          images: [
            {
              url: routes.bookmarks.seo.image,
              alt: routes.bookmarks.seo.description,
            },
          ],
        }}
      />
      <Detail.Container data-cy="bookmark-detail" ref={scrollContainerRef}>
        <TitleBar
          backButton
          globalMenu={false}
          backButtonHref={'/bookmarks'}
          magicTitle
          title={bookmark.title}
          titleRef={titleRef}
          scrollContainerRef={scrollContainerRef}
          trailingAccessory={<BookmarkActions bookmark={bookmark} />}
        />

        <Detail.ContentContainer>
          <Detail.Header>
            <Tags tags={bookmark.tags} />
            <Link
              href={bookmark.url}
              target="_blank"
              rel="noopener"
              className="block"
            >
              <Detail.Title ref={titleRef}>{bookmark.title}</Detail.Title>
            </Link>
            <Link
              href={bookmark.url}
              target="_blank"
              rel="noopener"
              className="flex items-center space-x-2 leading-snug text-tertiary"
            >
              {bookmark.faviconUrl && (
                <img
                  src={bookmark.faviconUrl}
                  alt={`Favicon for ${bookmark.host}`}
                  className="w-4 h-4"
                  width="16px"
                  height="16px"
                />
              )}
              <span>{bookmark.host}</span>
            </Link>
            {bookmark.description && (
              <MarkdownRenderer
                className="italic prose opacity-70"
                children={bookmark.description}
                variant="comment"
              />
            )}
          </Detail.Header>
          <div className="mt-6">
            <PrimaryButton
              size="large"
              href={bookmark.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <LinkIcon size={14} />
              <span>Visit</span>
            </PrimaryButton>
          </div>

          <div className="justify-center mt-6 flex">
            <div className="w-full max-w-3xl mx-auto">
              <Campsite referrer="/bookmark" />
            </div>
          </div>
        </Detail.ContentContainer>

        <RelatedBookmarks bookmark={bookmark} />

        <Comments refId={bookmark.id} type={CommentType.Bookmark} />
      </Detail.Container>
    </>
  )
}
