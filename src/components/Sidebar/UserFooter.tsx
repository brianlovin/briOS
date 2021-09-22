import * as React from 'react'
import { useUser } from '@auth0/nextjs-auth0'
import LoadingSpinner from '~/components/LoadingSpinner'

function Container({ children }) {
  return (
    <div className="sticky bottom-0 z-10 flex items-center p-2 space-x-3 bg-white border-t border-gray-150 dark:bg-gray-900 dark:border-gray-800 bg-opacity-80 filter-blur dark:bg-opacity-60">
      {children}
    </div>
  )
}

export function UserFooter() {
  const { user, error, isLoading } = useUser()

  if (isLoading) {
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

  if (user) {
    return (
      <Container>
        <a
          className="w-full text-sm font-medium py-1.5 text-center rounded-md text-primary hover:bg-gray-200 dark:hover:bg-gray-700"
          href="/api/auth/logout"
        >
          Log out
        </a>
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
