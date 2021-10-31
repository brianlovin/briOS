import * as React from 'react'
import { Plus } from 'react-feather'

import { GhostButton } from '~/components/Button'
import { TitleBar } from '~/components/ListDetail/TitleBar'
import { SignInDialog } from '~/components/SignInDialog'
import { UserRole, useViewerQuery } from '~/graphql/types.generated'

import { AddQuestionDialog } from './AddQuestionDialog'
import { QuestionsFilterButton } from './FilterButton'
import { QuestionsContext } from './QuestionsList'

export function AMATitlebar({ scrollContainerRef }) {
  const { data } = useViewerQuery()

  function getAddButton() {
    if (!data?.viewer) {
      return (
        <SignInDialog
          trigger={
            <GhostButton size="small-square" data-cy="open-add-question-dialog">
              <Plus size={16} />
            </GhostButton>
          }
        />
      )
    }

    return (
      <AddQuestionDialog
        trigger={
          <GhostButton size="small-square" data-cy="open-add-question-dialog">
            <Plus size={16} />
          </GhostButton>
        }
      />
    )
  }

  function getFilterButton() {
    if (!data?.viewer) return null
    if (data.viewer.role !== UserRole.Admin) return null

    return <QuestionsFilterButton />
  }

  function trailingAccessory() {
    return (
      <div className="flex items-center space-x-2">
        {getFilterButton()}
        {getAddButton()}
      </div>
    )
  }

  return (
    <QuestionsContext.Consumer>
      {({ filterPending }) => {
        const title = !data?.viewer
          ? 'Ask me anything'
          : data.viewer.role === UserRole.Admin
          ? filterPending
            ? 'Pending questions'
            : 'Answered questions'
          : 'Ask me anything'

        return (
          <TitleBar
            scrollContainerRef={scrollContainerRef}
            title={title}
            trailingAccessory={trailingAccessory()}
          />
        )
      }}
    </QuestionsContext.Consumer>
  )
}
