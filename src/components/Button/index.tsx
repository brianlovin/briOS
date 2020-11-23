import * as React from 'react'

interface Props {
  onClick?: any
  children: React.ReactChildren | React.ReactChild
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
}

export function Button({ children, ...rest }: Props) {
  return (
    <button
      {...rest}
      className="flex items-center justify-center px-4 py-2 space-x-2 text-sm font-medium transition-shadow bg-white border rounded shadow-sm hover:border-gray-300 dark:border-gray-800 dark:bg-gray-800 dark:hover:bg-gray-700 dark:hover:border-gray-600 focus:outline-none text-primary"
    >
      {children}
    </button>
  )
}

export function PrimaryButton({ children, ...rest }: Props) {
  return (
    <button
      {...rest}
      className="flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded shadow-sm hover:bg-blue-600 dark:hover:bg-blue-400 focus:outline-none "
    >
      {children}
    </button>
  )
}
