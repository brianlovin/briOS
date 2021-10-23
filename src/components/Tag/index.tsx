import * as React from 'react'

export function Tags({ tags }) {
  if (!tags || tags.length === 0) return null

  return (
    <div className="flex flex-wrap space-x-2">
      {tags.map((tag) => (
        <Tag key={tag.name} name={tag.name} />
      ))}
    </div>
  )
}

export function Tag({ name }) {
  const baseClasses =
    'self-start rounded-full px-3 py-0.5 text-xs font-semibold leading-5 tracking-wide bg-opacity-5 dark:bg-opacity-20'

  let specificClasses =
    'dark:text-purple-400 dark:border-purple-400 text-purple-600 bg-purple-500'

  switch (name.toLowerCase()) {
    case 'indie': {
      specificClasses =
        'dark:text-purple-400 dark:border-purple-400 text-purple-600 bg-purple-500'
      break
    }
    case 'open source': {
      specificClasses =
        'dark:text-green-400 dark:border-green-400 text-green-600 bg-green-500'
      break
    }
    case 'portfolio': {
      specificClasses =
        'dark:text-blue-400 dark:border-blue-400 text-blue-600 bg-blue-500'
      break
    }
    case 'website': {
      specificClasses =
        'dark:text-red-400 dark:border-red-400 text-red-600 bg-red-500'
      break
    }
    case 'reading': {
      specificClasses =
        'dark:text-gray-400 dark:border-gray-400 text-gray-600 bg-gray-500'
      break
    }
  }
  return (
    <span className={`${baseClasses}${specificClasses}`}>
      {name.toUpperCase()}
    </span>
  )
}
