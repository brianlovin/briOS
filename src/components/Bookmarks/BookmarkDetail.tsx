import * as React from 'react'
import { useRouter } from 'next/router'
import { useGetBookmarkQuery } from '~/graphql/types.generated'
import TitleBar from '~/components/ListDetail/TitleBar'
import { BookmarkActions } from './BookmarkActions'

export function BookmarkDetail({ id }) {
  const scrollContainerRef = React.useRef(null)
  const titleRef = React.useRef(null)
  const router = useRouter()
  const { data, loading, error } = useGetBookmarkQuery({ variables: { id } })

  React.useEffect(() => {
    console.log({ data, loading, error })
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
        className="w-full max-h-screen overflow-y-auto bg-white dark:bg-black"
      >
        <TitleBar
          backButton
          globalMenu={false}
          backButtonHref={'/writing'}
          magicTitle
          title={data.bookmark.title}
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
                {data.bookmark.title}
              </h1>
              <span className="inline-block leading-snug text-tertiary">
                {data.bookmark.host}
              </span>
              <BookmarkActions bookmark={data.bookmark} />
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  )
}
