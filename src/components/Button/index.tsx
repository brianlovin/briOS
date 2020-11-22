import * as React from 'react'

interface Props {
  onClick: any
  children: React.ReactChildren | React.ReactChild
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
}

export function Button({ children, ...rest }: Props) {
  return (
    <button
      {...rest}
      className="flex justify-center border dark:border-gray-800 transition-shadow items-center px-4 py-2 rounded text-sm font-medium  dark:bg-gray-800 shadow-sm dark:hover:bg-gray-700 focus:outline-none  bg-white  text-primary"
    >
      {children}
    </button>
  )
}

export function PrimaryButton({ children, ...rest }: Props) {
  return (
    <button
      {...rest}
      className="flex items-center justify-center px-4 py-2 rounded shadow-sm text-sm font-medium text-white bg-blue-500  hover:bg-blue-600 dark:hover:bg-blue-400 focus:outline-none "
    >
      {children}
    </button>
  )
}
