import * as React from 'react'

interface TimelineEntryProps {
  children?: React.ReactChild | React.ReactChild[]
  title: string
  timestamp?: string
  description?: string
}

export function Notes({ children }) {
  return (
    <div className="-mt-2 prose timeline-inset prose-md text-primary">
      {children}
    </div>
  )
}

export function ButtonSet({ children }) {
  return (
    <div className="flex flex-wrap space-y-3 md:space-y-0 md:space-x-3 timeline-inset">
      {children}
    </div>
  )
}

export function TimelineEntry({
  title,
  timestamp,
  description,
}: TimelineEntryProps) {
  return (
    <div className="flex py-4 pl-6 border-l border-gray-300 border-dashed dark:border-gray-800">
      <div className="flex flex-col space-y-1">
        <span className="text-quaternary">{timestamp}</span>
        <span className="text-primary">{title}</span>
        {description && <span className="text-tertiary">{description}</span>}
      </div>
    </div>
  )
}

interface DateEntryProps {
  title: string
}

export function DateEntry({ title }: DateEntryProps) {
  return (
    <div className="flex items-center my-8 -ml-1 timeline-item">
      <p className="flex items-center font-medium">
        <span className="pr-4 text-2xl font-normal">⨰</span>
        <span>{title}</span>
      </p>
    </div>
  )
}
