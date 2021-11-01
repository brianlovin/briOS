import Link from 'next/link'
import * as React from 'react'
import { Link as LinkIcon } from 'react-feather'

import { PrimaryButton } from '~/components/Button'
import { Comments } from '~/components/Comments'
import { Detail } from '~/components/ListDetail/Detail'
import { TitleBar } from '~/components/ListDetail/TitleBar'
import { Tags } from '~/components/Tag'
import { CommentType, useGetBookmarkQuery } from '~/graphql/types.generated'

import { BookmarkActions } from './BookmarkActions'
import { RelatedBookmarks } from './RelatedBookmarks'

export function BookmarkDetail({ id }) {
  const scrollContainerRef: React.RefObject<HTMLDivElement> = React.useRef(null)
  const titleRef: React.RefObject<HTMLHeadingElement> = React.useRef(null)
  const { data, loading, error } = useGetBookmarkQuery({
    variables: { id },
  })

  if (error) {
    return null
  }

  if (loading) {
    return <Detail.Loading />
  }

  if (!data || !data.bookmark) {
    return null
  }

  const { bookmark } = data

  return (
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
          <Link href={bookmark.url}>
            <a className="block">
              <Detail.Title ref={titleRef}>{bookmark.title}</Detail.Title>
            </a>
          </Link>
          <Link href={bookmark.url}>
            <a className="flex items-center space-x-2 leading-snug text-tertiary">
              {bookmark.faviconUrl && (
                <img src={bookmark.faviconUrl} className="w-4 h-4" />
              )}
              <span>{bookmark.host}</span>
            </a>
          </Link>
          {bookmark.description && (
            <p className="italic prose opacity-70">{bookmark.description}</p>
          )}
        </Detail.Header>
        <div className="mt-6">
          <PrimaryButton size="large" href={bookmark.url}>
            <LinkIcon size={14} />
            <span>Visit</span>
          </PrimaryButton>
        </div>
      </Detail.ContentContainer>

      <RelatedBookmarks bookmark={bookmark} />

      <Comments refId={bookmark.id} type={CommentType.Bookmark} />
    </Detail.Container>
  )
}
