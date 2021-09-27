import * as React from 'react'
import { useRouter } from 'next/router'
import { useGetBookmarkQuery } from '~/graphql/types.generated'
import TitleBar from '~/components/ListDetail/TitleBar'
import { Comments } from '~/components/Comments'
import { BookmarkActions } from './BookmarkActions'

export function BookmarkDetail({ id }) {
  const scrollContainerRef = React.useRef(null)
  const titleRef = React.useRef(null)
  const router = useRouter()
  const { data, loading, error, refetch } = useGetBookmarkQuery({
    variables: { id },
  })

  React.useEffect(() => {
    if (!loading && !data?.bookmark) router.push('/bookmarks')
  }, [loading])

  if (error || loading) {
    return null
  }

  if (!data || !data.bookmark) {
    return null
  }

  return (
    <React.Fragment>
      <div
        ref={scrollContainerRef}
        className="relative flex flex-col w-full max-h-screen overflow-y-auto bg-white dark:bg-black"
      >
        <TitleBar
          backButton
          globalMenu={false}
          backButtonHref={'/writing'}
          magicTitle
          title={data.bookmark.title}
          titleRef={titleRef}
          scrollContainerRef={scrollContainerRef}
          trailingAccessory={<BookmarkActions bookmark={data.bookmark} />}
        />

        <div className="w-full max-w-3xl px-4 py-8 mx-auto border-b dark:border-gray-800 border-gray-150 md:px-6">
          <div data-cy="post" className="space-y-8">
            <div className="space-y-2">
              <h1
                ref={titleRef}
                className="font-sans text-2xl font-bold md:text-3xl text-primary"
              >
                {data.bookmark.title}
              </h1>
              <span className="inline-block leading-snug text-tertiary">
                {data.bookmark.host}
              </span>
              {data.bookmark.description && (
                <p className="prose text-primary">
                  {data.bookmark.description}
                </p>
              )}
            </div>
          </div>
        </div>

        <Comments
          refId={data.bookmark.id}
          refetch={refetch}
          comments={data.bookmark.comments}
        />
      </div>
    </React.Fragment>
  )
}
