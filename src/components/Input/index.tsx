import * as React from 'react'
import TextareaAutosize from 'react-autosize-textarea'

const styles =
  'w-full rounded-md focus:outline-none px-4 py-2 focus:border-gray-1000 text-primary border-gray-300 dark:border-gray-800 dark:focus:border-gray-600 bg-gray-1000 dark:bg-white bg-opacity-5 hover focus:ring-0'

export function Input(props) {
  return <input className={styles} {...props} />
}

export function Textarea({ maxRows = 8, rows = 2, ...props }) {
  return (
    <TextareaAutosize
      maxRows={maxRows}
      rows={rows}
      className={`${styles} block`}
      {...props}
    />
  )
}

export function Select(props) {
  return <select className={styles} {...props} />
}
