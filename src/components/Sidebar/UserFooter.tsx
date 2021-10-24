import Link from 'next/link'
import * as React from 'react'
import { Settings } from 'react-feather'

import { Avatar } from '~/components/Avatar'
import { GhostButton } from '~/components/Button'
import { LoadingSpinner } from '~/components/LoadingSpinner'
import { useViewerQuery } from '~/graphql/types.generated'

function Container({ children }) {
  return (
    <div className="sticky bottom-0 z-10 flex items-center justify-between p-2 space-x-3 bg-white border-t border-gray-150 dark:bg-gray-900 dark:border-gray-800 bg-opacity-80 filter-blur dark:bg-opacity-60">
      {children}
    </div>
  )
}

export function UserFooter() {
  const { data, loading, error } = useViewerQuery()

  if (loading) {
    return (
      <Container>
        <div className="flex items-center justify-center w-full py-1">
          <LoadingSpinner />
        </div>
      </Container>
    )
  }

  if (error) {
    return (
      <Container>
        <GhostButton href="/api/auth/login">Sign in</GhostButton>
      </Container>
    )
  }

  if (data?.viewer) {
    return (
      <Container>
        <Link href={`/u/${data.viewer.username}`}>
          <a className="flex items-center flex-none rounded-full">
            <Avatar
              user={data.viewer}
              src={data.viewer.avatar}
              width={24}
              height={24}
              layout="fixed"
              className="rounded-full"
            />
          </a>
        </Link>
        <GhostButton size="small-square" href="/settings">
          <Settings size={16} />
        </GhostButton>
      </Container>
    )
  }

  return (
    <Container>
      <GhostButton style={{ width: '100%' }} href="/api/auth/login">
        Sign in
      </GhostButton>
    </Container>
  )
}
