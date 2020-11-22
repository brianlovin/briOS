import * as React from 'react'

const styles =
  'w-full focus:outline-none py-2 px-3 text-base rounded shadow-sm focus:border-blue-500 text-primary border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-1000'

export function Input(props) {
  return <input className={styles} {...props} />
}

export function Textarea(props) {
  return <textarea className={styles} {...props} />
}
