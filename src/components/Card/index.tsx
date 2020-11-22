import * as React from 'react'

export default function Card(props) {
  const { className, ...rest } = props
  return (
    <div
      className={`bg-white dark:bg-gray-900 rounded-lg shadow hover:shadow-cardHover ${className}`}
      {...rest}
    />
  )
}
