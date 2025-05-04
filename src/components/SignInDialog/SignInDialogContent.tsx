import { useRouter } from 'next/router'
import React from 'react'

export function SignInDialogContent() {
  const router = useRouter()

  function handleSignIn() {
    // TODO: Replace with your new authentication method
    router.push('/auth/signin')
  }

  return (
    <div className="p-4">
      <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-gray-100">
        Sign in to continue
      </h3>
      <div className="mt-2">
        <p className="text-sm text-gray-500">
          Sign in with your Twitter account to continue.
        </p>
      </div>
      <div className="mt-4">
        <button
          type="button"
          className="inline-flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
          onClick={handleSignIn}
        >
          Sign in with Twitter
        </button>
      </div>
    </div>
  )
}
