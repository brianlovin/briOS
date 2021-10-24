import * as React from 'react'
import TitleBar from '~/components/ListDetail/TitleBar'
import { AddQuestionDialog } from './AddQuestionDialog'
import { UserRole, useViewerQuery } from '~/graphql/types.generated'
import { GhostButton } from '../Button'
import { Plus } from 'react-feather'
import { SignInDialog } from '../SignIn'
import { QuestionsFilterButton } from './FilterButton'

export function AMATitlebar({ scrollContainerRef }) {
  const { data } = useViewerQuery()

  function getAddButton() {
    if (!data?.viewer) {
      return (
        <SignInDialog
          trigger={
            <GhostButton size="small-square">
              <Plus size={16} />
            </GhostButton>
          }
        />
      )
    }

    return (
      <AddQuestionDialog
        trigger={
          <GhostButton size="small-square">
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
      <div className="flex space-x-2">
        {getFilterButton()}
        {getAddButton()}
      </div>
    )
  }

  return (
    <TitleBar
      scrollContainerRef={scrollContainerRef}
      title={'Ask me anything'}
      trailingAccessory={trailingAccessory()}
    />
  )
}
