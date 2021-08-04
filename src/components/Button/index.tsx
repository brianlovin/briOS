import * as React from 'react'

type Props = {
  className?: string
  onClick?: any
  disabled?: boolean
  children: React.ReactChild | string | string[]
  type?: string
} & React.ComponentPropsWithoutRef<'button'>

export default function Button({ className, ...rest }: Props) {
  return (
    <button
      className={`flex items-center rounded justify-center flex-none px-4 py-1.5 space-x-3 font-medium bg-white border border-gray-200 dark:border-gray-700 dark:hover:border-gray-600 disabled:opacity-50 dark:bg-white dark:bg-opacity-10 disabled:bg-opacity-0 disabled:opacity-0 text-primary hover:border-gray-300 focus:border-gray-1000 dark:focus:border-gray-600 focus:ring-0 focus:outline-none ${className}`}
      {...rest}
    />
  )
}

export function DeleteButton({ className, ...rest }: Props) {
  return (
    <button
      className={`flex items-center rounded justify-center flex-none px-4 py-1.5 space-x-3 font-medium bg-white border border-gray-200 dark:border-red-500 dark:hover:border-red-500 disabled:opacity-50 dark:bg-red-500 dark:border-opacity-20 dark:bg-opacity-10 disabled:bg-opacity-0 text-red-500 hover:border-red-500 hover:text-white hover:bg-red-600 focus:border-red-900 focus:ring-0 focus:outline-none ${className}`}
      {...rest}
    />
  )
}

export function RecordingButton({ className, ...rest }: Props) {
  return (
    <button
      className={`flex items-center rounded justify-center flex-none px-4 py-1.5 space-x-3 font-medium bg-green-500 border border-green-600 dark:border-green-500 dark:hover:border-green-500 disabled:opacity-50 dark:bg-green-500 dark:border-opacity-20 dark:bg-opacity-10 disabled:bg-opacity-0 text-white hover:bg-green-600 focus:border-green-900 focus:ring-0 focus:outline-none ${className}`}
      {...rest}
    />
  )
}

export function LinkButton({ className, ...rest }: Props) {
  return (
    <button
      className={`flex items-center rounded justify-center flex-none px-4 py-1.5 space-x-3 font-medium bg-transparent disabled:opacity-50 dark:bg-opacity-10 disabled:bg-opacity-0 text-gray-800 dark:text-gray-300 dark:hover:text-gray-200 hover:text-black hover:bg-gray-200 dark:hover:bg-gray-800 focus:ring-0 focus:outline-none border border-transparent focus:border-gray-200 dark:focus:border-gray-800 ${className}`}
      {...rest}
    />
  )
}
