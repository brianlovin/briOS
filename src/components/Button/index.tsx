import * as React from 'react'
import Link from 'next/link'

function BaseButton({ href, ...rest }) {
  if (href && href.startsWith('/')) {
    return (
      <Link href={href}>
        <a {...rest} />
      </Link>
    )
  }

  if (href) {
    return <a href={href} {...rest} />
  }

  return <button {...rest} />
}

const baseClasses =
  'flex items-center justify-center rounded-md cursor-pointer leading-none transition-all font-semibold focus:outline-none'

function getSize(size = null) {
  switch (size) {
    case 'large': {
      return 'px-5 py-4 text-base'
    }
    case 'small': {
      return 'px-3 py-2 text-sm'
    }
    case 'small-square': {
      return 'p-2 text-sm'
    }
    default: {
      return 'px-4 py-2 text-sm'
    }
  }
}

const composer = {
  getSize,
}

export default function Button(props) {
  const classes = `text-gray-700 hover:text-gray-1000 shadow-xs bg-white border border-gray-400 border-opacity-30 dark:border-gray-700 dark:hover:border-gray-600 dark:bg-white dark:bg-opacity-10 dark:text-gray-200 dark:hover:text-white hover:border-opacity-50 hover:shadow-sm focus:border-gray-1000 dark:focus:border-gray-600`
  const size = composer.getSize(props.size)
  const composed = `${baseClasses} ${size} ${classes}`
  return <BaseButton className={composed} {...props} />
}

export function DeleteButton(props) {
  const classes = `bg-white border border-gray-200 dark:border-red-500 dark:hover:border-red-500  dark:bg-red-500 dark:border-opacity-20 dark:bg-opacity-10 text-red-500 hover:border-red-500 hover:text-white hover:bg-red-600 focus:border-red-900`

  const size = composer.getSize(props.size)
  const composed = `${baseClasses} ${size} ${classes}`
  return <BaseButton className={composed} {...props} />
}

export function RecordingButton(props) {
  const classes = `bg-green-500 border border-green-600 dark:border-green-500 dark:hover:border-green-500 dark:bg-green-500 dark:border-opacity-20 dark:bg-opacity-10  text-white hover:bg-green-600 focus:border-green-900`
  const size = composer.getSize(props.size)
  const composed = `${baseClasses} ${size} ${classes}`
  return <BaseButton className={composed} {...props} />
}

export function GhostButton(props) {
  const classes = `text-gray-700 hover:text-gray-1000 bg-gray-200 bg-opacity-0 hover:bg-opacity-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:text-white focus:border-gray-1000 dark:focus:border-gray-600`
  const size = composer.getSize(props.size)
  const composed = `${baseClasses} ${size} ${classes}`
  return <BaseButton className={composed} {...props} />
}
