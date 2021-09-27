import * as React from 'react'
import Link from 'next/link'

type Props = {
  className?: string
  onClick?: Function
  disabled?: boolean
  children: React.ReactChild | string | string[]
  type?: string
  href?: string
} & React.ComponentPropsWithoutRef<'button'>

export default function Button({ className, href, children, ...rest }: Props) {
  const classes = `flex font-sans text-sm 2xl:text-base text-gray-700 hover:text-gray-1000 items-center shadow-xs rounded-md justify-center flex-none px-6 py-1.5 space-x-3 font-semibold bg-white border border-gray-400 border-opacity-30 dark:border-gray-700 dark:hover:border-gray-600 disabled:opacity-50 dark:bg-white dark:bg-opacity-10 dark:text-gray-200 dark:hover:text-white leading-none disabled:bg-opacity-0 disabled:opacity-0 hover:border-opacity-50 hover:shadow-sm transition-shadow focus:border-gray-1000 dark:focus:border-gray-600 focus:ring-0 focus:outline-none cursor-pointer ${className}`

  if (href) {
    if (href.startsWith('/')) {
      return (
        <Link href={href}>
          <a className={classes} children={children} />
        </Link>
      )
    }

    return <a className={classes} children={children} />
  }
  return <button className={classes} children={children} {...rest} />
}

export function SmallButton({ className, href, children, ...rest }: Props) {
  const classes = `flex font-sans text-sm text-gray-700 hover:text-gray-1000 items-center shadow-xs rounded-md justify-center flex-none px-2 py-1.5 space-x-3 font-medium bg-white border border-gray-400 border-opacity-30 dark:border-gray-700 dark:hover:border-gray-600 disabled:opacity-50 dark:bg-white dark:bg-opacity-10 dark:text-gray-200 dark:hover:text-white leading-none disabled:bg-opacity-0 disabled:opacity-0 hover:border-opacity-50 hover:shadow-sm transition-shadow focus:border-gray-1000 dark:focus:border-gray-600 focus:ring-0 focus:outline-none cursor-pointer ${className}`

  if (href) {
    if (href.startsWith('/')) {
      return (
        <Link href={href}>
          <a className={classes} children={children} />
        </Link>
      )
    }

    return <a className={classes} children={children} />
  }
  return <button className={classes} children={children} {...rest} />
}

export function DeleteButton({ className, ...rest }: Props) {
  return (
    <button
      className={`flex items-center rounded-md justify-center flex-none px-4 py-1.5 space-x-3 font-medium bg-white border border-gray-200 dark:border-red-500 dark:hover:border-red-500 disabled:opacity-50 dark:bg-red-500 dark:border-opacity-20 dark:bg-opacity-10 disabled:bg-opacity-0 text-red-500 hover:border-red-500 hover:text-white hover:bg-red-600 focus:border-red-900 focus:ring-0 focus:outline-none ${className}`}
      {...rest}
    />
  )
}

export function RecordingButton({ className, ...rest }: Props) {
  return (
    <button
      className={`flex items-center rounded-md justify-center flex-none px-4 py-1.5 space-x-3 font-medium bg-green-500 border border-green-600 dark:border-green-500 dark:hover:border-green-500 disabled:opacity-50 dark:bg-green-500 dark:border-opacity-20 dark:bg-opacity-10 disabled:bg-opacity-0 text-white hover:bg-green-600 focus:border-green-900 focus:ring-0 focus:outline-none ${className}`}
      {...rest}
    />
  )
}

export function LinkButton({ className, ...rest }: Props) {
  return (
    <button
      className={`flex items-center rounded-md justify-center flex-none px-4 py-1.5 space-x-3 font-medium bg-transparent disabled:opacity-50 dark:bg-opacity-10 disabled:bg-opacity-0 text-gray-800 dark:text-gray-300 dark:hover:text-gray-200 hover:text-black hover:bg-gray-200 dark:hover:bg-gray-800 focus:ring-0 focus:outline-none border border-transparent focus:border-gray-200 dark:focus:border-gray-800 ${className}`}
      {...rest}
    />
  )
}
