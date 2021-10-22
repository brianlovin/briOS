import Image from 'next/image'
import * as React from 'react'
import { GET_STACK } from '~/graphql/queries/stack'
import {
  useGetStackQuery,
  UserRole,
  useToggleStackUserMutation,
  useViewerQuery,
} from '~/graphql/types.generated'
import Tooltip from '../Tooltip'

export function StackUsedBy(props) {
  const { data: viewerData } = useViewerQuery()
  const { data, loading, error, refetch } = useGetStackQuery({
    variables: {
      id: props.stack.id,
    },
  })
  const [toggleStackUser] = useToggleStackUserMutation()

  React.useEffect(() => {
    const refetchQuery = () => refetch()
    window.addEventListener('focus', refetchQuery)
    return () => window.removeEventListener('focus', refetchQuery)
  })

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
        const { stack } = cache.readQuery({
          query: GET_STACK,
          variables: { id: props.stack.id },
        })

        cache.writeQuery({
          query: GET_STACK,
          variables: { id: props.stack.id },
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

  return (
    <div className="flex flex-col rounded-md">
      <div
        className={`flex flex-col p-4 space-y-4 bg-gray-100 border dark:border-gray-800 border-gray-200 dark:bg-white dark:bg-opacity-10 ${
          viewerData?.viewer && viewerData?.viewer.role !== UserRole.Admin
            ? 'rounded-t-md border-b-0'
            : 'rounded-md'
        }`}
      >
        {data.stack.usedBy.length === 0 ? (
          <p className="text-sm font-medium text-quaternary">
            Nobody else is using this yet...
          </p>
        ) : (
          <p className="text-sm font-medium text-quaternary">
            Also used by{' '}
            {data.stack.usedBy.length === 1
              ? `${data.stack.usedBy.length} person`
              : `${data.stack.usedBy.length} people`}
          </p>
        )}

        {data.stack.usedBy.length > 0 && (
          <div className="flex flex-wrap -m-1">
            {data.stack.usedBy.map((u) => (
              <Tooltip key={u.id} content={u.name}>
                <span className="inline-flex p-1">
                  <Image
                    src={u.avatar}
                    width={32}
                    height={32}
                    className="rounded-full"
                    layout="fixed"
                  />
                </span>
              </Tooltip>
            ))}
          </div>
        )}
      </div>
      {viewerData?.viewer && viewerData?.viewer.role !== UserRole.Admin && (
        <label className="flex items-start px-4 py-2 space-x-3 bg-white border border-gray-200 dark:border-gray-800 rounded-b-md dark:bg-gray-900">
          <input
            type="checkbox"
            onChange={handleChange}
            defaultChecked={data.stack.usedByViewer}
            className="relative w-4 h-4 border border-gray-300 rounded top-1 dark:border-gray-700"
          />
          <p className="font-medium text-primary">I use this</p>
        </label>
      )}
    </div>
  )
}
