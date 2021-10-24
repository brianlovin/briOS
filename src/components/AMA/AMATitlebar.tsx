import * as React from 'react'
import TitleBar from '~/components/ListDetail/TitleBar'
import { AddQuestionDialog } from './AddQuestionDialog'
import { useViewerQuery } from '~/graphql/types.generated'
import { GhostButton } from '../Button'
import { Plus } from 'react-feather'
import { SignInDialog } from '../SignIn'

export function AMATitlebar({ scrollContainerRef }) {
  const { data } = useViewerQuery()

  function trailingAccessory() {
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
  return (
    <TitleBar
      scrollContainerRef={scrollContainerRef}
      title={'Ask me anything'}
      trailingAccessory={trailingAccessory()}
    />
  )
}
