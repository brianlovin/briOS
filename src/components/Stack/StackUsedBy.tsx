import Link from 'next/link'
import * as React from 'react'

import { Avatar } from '~/components/Avatar'
import { Tooltip } from '~/components/Tooltip'
import {
  useGetStackQuery,
  useToggleStackUserMutation,
} from '~/graphql/types.generated'
import { useWindowFocus } from '~/hooks/useWindowFocus'

export function StackUsedBy(props) {
  const { triggerSignIn } = props
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

  return (
    <div className="flex flex-col pt-2 rounded-md">
      <div
        className={`flex flex-col space-y-4 rounded-md border border-gray-200 bg-gray-100 p-4 dark:border-gray-800 dark:bg-white dark:bg-opacity-10`}
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
    </div>
  )
}
