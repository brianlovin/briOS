import * as React from 'react'
import { useRouter } from 'next/router'
import {
  useGetAmaQuestionQuery,
  useGetBookmarkQuery,
} from '~/graphql/types.generated'
import TitleBar from '~/components/ListDetail/TitleBar'

export function AMADetail({ id }) {
  const scrollContainerRef = React.useRef(null)
  const titleRef = React.useRef(null)
  const router = useRouter()
  const { data, loading, error } = useGetAmaQuestionQuery({ variables: { id } })

  React.useEffect(() => {
    if (!loading && !data?.amaQuestion) router.push('/ama')
  }, [loading])

  if (error || loading) {
    return null
  }

  if (!data || !data?.amaQuestion) {
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
          title={data?.amaQuestion.question}
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
                {data?.amaQuestion.question}
              </h1>
              <span className="inline-block leading-snug text-tertiary">
                {data?.amaQuestion.updatedAt}
              </span>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  )
}