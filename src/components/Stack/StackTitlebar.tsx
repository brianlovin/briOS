import * as React from 'react'
import TitleBar from '~/components/ListDetail/TitleBar'
import { Plus } from 'react-feather'
import { AddStackDialog } from './AddStackDialog'
import { UserRole, useViewerQuery } from '~/graphql/types.generated'
import { GhostButton } from '../Button'

export function StackTitlebar({ scrollContainerRef }) {
  const { data } = useViewerQuery()

  function trailingAccessory() {
    if (data?.viewer?.role === UserRole.Admin) {
      return (
        <AddStackDialog
          trigger={
            <GhostButton size="small-square">
              <Plus size={16} />
            </GhostButton>
          }
        />
      )
    }
    return null
  }

  return (
    <TitleBar
      scrollContainerRef={scrollContainerRef}
      title="Stack"
      trailingAccessory={trailingAccessory()}
    />
  )
}
