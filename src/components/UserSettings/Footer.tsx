import { useRouter } from 'next/router'
import React from 'react'

export function Footer() {
  const router = useRouter()

  function handleLogout() {
    // TODO: Replace with your new authentication method
    router.push('/')
  }

  return (
    <div className="flex items-center justify-between py-4 border-t border-gray-150 dark:border-gray-800">
      <button
        onClick={handleLogout}
        className="text-sm font-medium text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300"
      >
        Log out
      </button>
    </div>
  )
}
