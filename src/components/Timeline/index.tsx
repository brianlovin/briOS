import * as React from 'react'
import { Edit2, Feather, GitCommit, Zap, Wind, Meh, Plus } from 'react-feather'

export function TimelineContainer({ children }) {
  return (
    <div className="flex flex-col w-full pt-8 timeline-container">
      {children}
    </div>
  )
}

interface TimelineItemProps {
  children?: React.ReactChild | React.ReactChildren
  title: string
  timestamp?: string
  icon: string
  tint?: string
}

function getIcon(name: string) {
  switch (name) {
    case 'git-commit':
    case 'commit':
      return <GitCommit size={16} />
    case 'feather':
      return <Feather size={16} />
    case 'zap':
      return <Zap size={16} />
    case 'wind':
      return <Wind size={16} />
    case 'meh':
      return <Meh size={16} />
    case 'plus':
      return <Plus size={16} />
    default:
      return <Edit2 size={16} />
  }
}

function getTint(color: string) {
  switch (color) {
    case 'red':
      return 'text-red-800 dark:text-red-200 bg-red-500 bg-opacity-20'
    case 'blue':
      return 'text-blue-800 dark:text-blue-200 bg-blue-500 bg-opacity-20'
    case 'green':
      return 'text-green-800 dark:text-green-200 bg-green-500 bg-opacity-20'
    case 'purple':
      return 'text-purple-800 dark:text-purple-200 bg-purple-500 bg-opacity-20'
    case 'indigo':
      return 'text-indigo-800 dark:text-indigo-200 bg-indigo-500 bg-opacity-20'
    case 'pink':
      return 'text-pink-800 dark:text-pink-200 bg-pink-500 bg-opacity-20'
    case 'yellow':
      return 'text-yellow-800 dark:text-yellow-200 bg-yellow-500 bg-opacity-20'
    case 'gray':
    default:
      return 'text-primary bg-gray-200 dark:bg-gray-800'
  }
}

export function TimelineItem({
  children = null,
  title,
  timestamp,
  icon = 'pencil',
  tint = 'gray',
}: TimelineItemProps) {
  return (
    <div className="flex mb-12 md:mb-8 timeline-item">
      <div className="flex flex-col items-center">
        <div
          className={`flex justify-center p-3 rounded-full align-center border-4 border-gray-50 dark:border-gray-1000 ${getTint(
            tint
          )}`}
        >
          {getIcon(icon)}
        </div>
        <div className="flex-1 w-px -mb-12 bg-gray-200 md:-mb-8 dark:bg-gray-800 timeline-stroke" />
      </div>
      <div className="flex flex-col flex-1 ml-4 space-y-4">
        <div className="flex flex-col pt-1 contents-center">
          <span className="font-medium text-primary">{title}</span>
          {timestamp && (
            <span className="text-sm text-tertiary">{timestamp}</span>
          )}
        </div>
        <div className="flex flex-col -ml-16 space-y-4 md:ml-0">{children}</div>
      </div>
    </div>
  )
}
