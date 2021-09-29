import * as React from 'react'
import TitleBar from '~/components/ListDetail/TitleBar'
import { Plus } from 'react-feather'
import { AddQuestionDialog } from './AddQuestionDialog'
import { AmaStatus } from '~/graphql/types.generated'

export function AMATitlebar({ scrollContainerRef, status }) {
  function trailingAccessory() {
    return (
      <AddQuestionDialog>
        <div className="flex items-center justify-center p-2 rounded-md cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-800">
          <Plus size={16} className="text-primary" />
        </div>
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
