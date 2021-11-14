import * as React from 'react'
import { Plus } from 'react-feather'

import { GhostButton } from '~/components/Button'
import { TitleBar } from '~/components/ListDetail/TitleBar'
import { useViewerQuery } from '~/graphql/types.generated'

import { AddStackDialog } from './AddStackDialog'

export function StackTitlebar({ scrollContainerRef }) {
  const { data } = useViewerQuery()

  function trailingAccessory() {
    if (data?.viewer?.isAdmin) {
      return (
        <AddStackDialog
          trigger={
            <GhostButton aria-label="Add Stack" size="small-square">
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
