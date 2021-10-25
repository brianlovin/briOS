import Link from 'next/link'
import { useRouter } from 'next/router'
import * as React from 'react'
import { Link as LinkIcon } from 'react-feather'

import { PrimaryButton } from '~/components/Button'
import { Comments } from '~/components/Comments'
import { Detail } from '~/components/ListDetail/Detail'
import { TitleBar } from '~/components/ListDetail/TitleBar'
import { Tags } from '~/components/Tag'
import { CommentType, useGetBookmarkQuery } from '~/graphql/types.generated'

import { BookmarkActions } from './BookmarkActions'

export function BookmarkDetail({ id }) {
  const scrollContainerRef: React.RefObject<HTMLDivElement> = React.useRef(null)
  const titleRef: React.RefObject<HTMLHeadingElement> = React.useRef(null)
  const router = useRouter()
  const { data, loading, error } = useGetBookmarkQuery({
    variables: { id },
  })

  React.useEffect(() => {
    if (!loading && !data?.bookmark) router.push('/bookmarks')
  }, [loading])

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
            <a className="inline-block leading-snug text-tertiary">
              {bookmark.host}
            </a>
          </Link>
          {bookmark.description && (
            <p className="prose text-primary">{bookmark.description}</p>
          )}
        </Detail.Header>
        <div className="mt-6">
          <PrimaryButton size="large" href={bookmark.url}>
            <LinkIcon size={14} />
            <span>Visit</span>
          </PrimaryButton>
        </div>
      </Detail.ContentContainer>

      <Comments refId={bookmark.id} type={CommentType.Bookmark} />
    </Detail.Container>
  )
}
