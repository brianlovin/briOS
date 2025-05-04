import { useRouter } from 'next/router'
import React from 'react'

export function UserFooter() {
  const router = useRouter()

  function handleSignIn() {
    // TODO: Replace with your new authentication method
    router.push('/auth/signin')
  }

  return (
    <div className="flex items-center justify-between p-4 border-t border-gray-200 dark:border-gray-800">
      <button
        onClick={handleSignIn}
        className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
      >
        Sign in
      </button>
    </div>
  )
}
