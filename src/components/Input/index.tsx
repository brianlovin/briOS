import * as React from 'react'

const styles =
  'font-mono w-full focus:outline-none px-4 py-2 border-none focus:border-gray-1000 text-primary border-gray-200  bg-gray-1000 dark:bg-white bg-opacity-5 hover:bg-opacity-10 focus:ring-0'

export function Input(props) {
  return <input className={styles} {...props} />
}

export function Textarea(props) {
  return <textarea className={`${styles} block`} {...props} />
}
