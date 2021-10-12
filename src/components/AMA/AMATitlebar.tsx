import * as React from 'react'
import TitleBar from '~/components/ListDetail/TitleBar'
import { Plus } from 'react-feather'
import { AddQuestionDialog } from './AddQuestionDialog'
import { AmaStatus } from '~/graphql/types.generated'
import { GhostButton } from '../Button'

export function AMATitlebar({ scrollContainerRef, status }) {
  function trailingAccessory() {
    return (
      <AddQuestionDialog>
        <GhostButton size="small-square">
          <Plus size={16} />
        </GhostButton>
      </AddQuestionDialog>
    )
  }

  return (
    <TitleBar
      scrollContainerRef={scrollContainerRef}
      title={status === AmaStatus.Answered ? 'Ask me anything' : 'Pending'}
      trailingAccessory={trailingAccessory()}
    />
  )
}
