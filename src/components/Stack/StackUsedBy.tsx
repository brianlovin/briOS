import Link from 'next/link'
import * as React from 'react'

import { Avatar } from '~/components/Avatar'
import { Tooltip } from '~/components/Tooltip'
import { GET_STACK } from '~/graphql/queries/stack'
import {
  GetStackQuery,
  useGetStackQuery,
  useToggleStackUserMutation,
  useViewerQuery,
} from '~/graphql/types.generated'
import { useWindowFocus } from '~/hooks/useWindowFocus'

export function StackUsedBy(props) {
  const { triggerSignIn } = props
  const { data: viewerData } = useViewerQuery()
  const { data, loading, error, refetch } = useGetStackQuery({
    variables: { slug: props.stack.slug },
  })
  const [toggleStackUser] = useToggleStackUserMutation()

  useWindowFocus({ onFocus: refetch })

  if (loading) {
    return null
  }

  if (error) {
    return null
  }

  function handleChange() {
    return toggleStackUser({
      variables: {
        id: props.stack.id,
      },
      optimisticResponse: {
        __typename: 'Mutation',
        toggleStackUser: {
          __typename: 'Stack',
          ...props.stack,
          usedByViewer: !data?.stack?.usedByViewer,
          usedBy: data?.stack?.usedByViewer
            ? data?.stack?.usedBy.filter((u) => u.id !== viewerData?.viewer?.id)
            : [...data?.stack?.usedBy, viewerData?.viewer],
        },
      },
      update(cache) {
        const { stack } = cache.readQuery<GetStackQuery>({
          query: GET_STACK,
          variables: { slug: props.stack.slug },
        })

        cache.writeQuery({
          query: GET_STACK,
          variables: { slug: props.stack.slug },
          data: {
            stack: {
              ...stack,
              usedByViewer: !data?.stack?.usedByViewer,
              usedBy: data?.stack?.usedByViewer
                ? data?.stack?.usedBy.filter(
                    (u) => u.id !== viewerData?.viewer?.id
                  )
                : [...data?.stack?.usedBy, viewerData?.viewer],
            },
          },
        })
      },
    })
  }

  function handleToggle() {
    if (viewerData?.viewer) {
      return handleChange()
    } else {
      return triggerSignIn()
    }
  }

  return (
    <div className="flex flex-col pt-2 rounded-md">
      <div
        className={`flex flex-col space-y-4 rounded-t-md border border-b-0 border-gray-200 bg-gray-100 p-4 dark:border-gray-800 dark:bg-white dark:bg-opacity-10`}
      >
        {data?.stack?.usedBy.length === 0 ? (
          <p className="text-sm font-medium text-quaternary">
            Nobody else is using this yet...
          </p>
        ) : (
          <p className="text-sm font-medium text-quaternary">
            Also used by{' '}
            {data?.stack?.usedBy.length === 1
              ? `${data?.stack?.usedBy.length} person`
              : `${data?.stack?.usedBy.length} people`}
          </p>
        )}

        {data?.stack?.usedBy.length > 0 && (
          <div className="flex flex-wrap -m-1">
            {data.stack.usedBy.map((user) => (
              <Tooltip key={user.id} content={user.name}>
                <span>
                  <Link
                    href={`/u/${user.username}`}
                    passHref
                    className="inline-flex p-1"
                  >
                    <Avatar
                      user={user}
                      src={user.avatar}
                      width={32}
                      height={32}
                      className="rounded-full"
                      layout="fixed"
                    />
                  </Link>
                </span>
              </Tooltip>
            ))}
          </div>
        )}
      </div>
      <label className="flex items-center px-4 py-2 space-x-3 bg-white border border-gray-200 rounded-b-md dark:border-gray-800 dark:bg-gray-900">
        <input
          type="checkbox"
          onChange={handleToggle}
          checked={data?.stack?.usedByViewer}
          className="w-4 h-4 border border-gray-300 rounded dark:border-gray-700"
        />
        <p className="text-sm font-medium text-primary">I use this</p>
      </label>
    </div>
  )
}
