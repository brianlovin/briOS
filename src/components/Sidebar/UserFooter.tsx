import * as React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import LoadingSpinner from '~/components/LoadingSpinner'
import { Settings } from 'react-feather'
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
        <a
          className="w-full text-sm font-medium py-1.5 text-center rounded-md text-primary hover:bg-gray-200 dark:hover:bg-gray-700"
          href="/api/auth/login"
        >
          Sign in
        </a>
      </Container>
    )
  }

  if (data?.viewer) {
    return (
      <Container>
        <div className="flex items-center flex-none">
          <Image
            src={data.viewer.avatar}
            width={24}
            height={24}
            layout="fixed"
            className="rounded-full"
          />
        </div>
        <Link href="/settings">
          <a className="p-2 text-center rounded-md text-tertiary hover:bg-gray-200 dark:hover:bg-gray-700">
            <Settings size={16} />
          </a>
        </Link>
      </Container>
    )
  }

  return (
    <Container>
      <a
        className="w-full text-sm font-medium py-1.5 text-center rounded-md text-primary hover:bg-gray-200 dark:hover:bg-gray-700"
        href="/api/auth/login"
      >
        Sign in
      </a>
    </Container>
  )
}
