import * as React from 'react'
import { GhostButton } from '../Button'
import { QuestionsContext } from './QuestionsList'

export function QuestionsFilterButton() {
  return (
    <QuestionsContext.Consumer>
      {({ setFilterPending, filterPending, pendingCount }) => {
        return (
          <div className="relative">
            {!filterPending && (
              <div className="absolute top-0 right-0 w-3 h-3 bg-yellow-500 border-2 border-white rounded-full dark:border-gray-900" />
            )}
            <GhostButton
              onClick={() => setFilterPending(!filterPending)}
              size="small-square"
            >
              {pendingCount}
            </GhostButton>
          </div>
        )
      }}
    </QuestionsContext.Consumer>
  )
}
