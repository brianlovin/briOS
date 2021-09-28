import * as React from 'react'
import TitleBar from '~/components/ListDetail/TitleBar'
import { Plus } from 'react-feather'
import { useIsMeQuery } from '~/graphql/types.generated'
import { AddQuestionDialog } from './AddQuestionDialog'

export function AMATitlebar({ scrollContainerRef }) {
  const { data } = useIsMeQuery()

  function trailingAccessory() {
    if (data?.isMe) {
      return (
        <AddQuestionDialog>
          <div className="flex items-center justify-center p-2 rounded-md cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-800">
            <Plus size={16} className="text-primary" />
          </div>
        </AddQuestionDialog>
      )
    }
    return null
  }

  return (
    <TitleBar
      scrollContainerRef={scrollContainerRef}
      title="Ask me anything"
      trailingAccessory={trailingAccessory()}
    />
  )
}
