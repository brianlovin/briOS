import * as React from 'react'
import TitleBar from '~/components/ListDetail/TitleBar'
import { AddQuestionDialog } from './AddQuestionDialog'
import { AmaStatus } from '~/graphql/types.generated'
import { GhostButton } from '../Button'
import { Plus } from 'react-feather'

export function AMATitlebar({ scrollContainerRef, status }) {
  function trailingAccessory() {
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
  return (
    <TitleBar
      scrollContainerRef={scrollContainerRef}
      title={status === AmaStatus.Answered ? 'Ask me anything' : 'Pending'}
      trailingAccessory={trailingAccessory()}
    />
  )
}
