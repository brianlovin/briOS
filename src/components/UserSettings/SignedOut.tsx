import { useRouter } from 'next/router'
import React from 'react'

export function SignedOut() {
  const router = useRouter()

  function handleSignIn() {
    // TODO: Replace with your new authentication method
    router.push('/auth/signin')
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-12 bg-gray-50 dark:bg-gray-900">
      <div className="px-4 py-8 bg-white rounded-lg shadow dark:bg-gray-800 sm:px-10">
        <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-gray-100">
          Sign in to continue
        </h2>
        <button
          onClick={handleSignIn}
          className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Sign in with Twitter
        </button>
      </div>
    </div>
  )
}
