import * as React from 'react'
import { Plus } from 'react-feather'

import { GhostButton } from '~/components/Button'
import { TitleBar } from '~/components/ListDetail/TitleBar'
import { SignInDialog } from '~/components/SignInDialog'
import { useViewerQuery } from '~/graphql/types.generated'

import SegmentedControl from '../SegmentedController'
import { AddQuestionDialog } from './AddQuestionDialog'
import { QuestionsContext } from './QuestionsList'

export function AMATitlebar({ scrollContainerRef }) {
  const { data } = useViewerQuery()
  const { setFilterPending, filterPending } = React.useContext(QuestionsContext)

  function getAddButton() {
    if (!data?.viewer) {
      return (
        <SignInDialog
          trigger={
            <GhostButton
              aria-label="Ask a question"
              size="small-square"
              data-cy="open-add-question-dialog"
            >
              <Plus size={16} />
            </GhostButton>
          }
        />
      )
    }

    return (
      <AddQuestionDialog
        trigger={
          <GhostButton
            aria-label="Ask a question"
            size="small-square"
            data-cy="open-add-question-dialog"
          >
            <Plus size={16} />
          </GhostButton>
        }
      />
    )
  }

  function trailingAccessory() {
    return <div className="flex items-center space-x-2">{getAddButton()}</div>
  }

  function getChildren() {
    if (data?.viewer?.isAdmin) {
      return (
        <div className="pt-2 pb-1">
          <SegmentedControl
            onSetActiveItem={() => setFilterPending(!filterPending)}
            active={filterPending ? 'pending' : 'answered'}
            items={[
              { id: 'answered', label: 'Answered' },
              { id: 'pending', label: 'Pending' },
            ]}
          />
        </div>
      )
    }
    return null
  }

  return (
    <TitleBar
      scrollContainerRef={scrollContainerRef}
      title="Ask me anything"
      trailingAccessory={trailingAccessory()}
    >
      {getChildren()}
    </TitleBar>
  )
}
