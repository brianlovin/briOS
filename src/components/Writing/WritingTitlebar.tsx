import * as React from 'react'
import { Plus, Radio } from 'react-feather'

import Button, { GhostButton } from '~/components/Button'
import { TitleBar } from '~/components/ListDetail/TitleBar'
import { UserRole, useViewerQuery } from '~/graphql/types.generated'

import { DialogComponent } from '../Dialog'
import { WritingSubscriptionForm } from './SubscriptionForm'

export function WritingTitlebar({ scrollContainerRef }) {
  const { data } = useViewerQuery()

  function getAddButton() {
    if (data?.viewer?.role === UserRole.Admin) {
      return (
        <GhostButton
          href="/writing/new"
          data-cy="new-post-button"
          size="small-square"
          aria-label="Add post"
        >
          <Plus size={16} />
        </GhostButton>
      )
    }
    return null
  }

  function getSubscribeButton() {
    if (data?.viewer?.role === UserRole.Admin) return null
    return (
      <DialogComponent
        title="Newsletter"
        trigger={
          <Button data-cy="open-subscribe-hn-dialog" size="small">
            <Radio size={16} />
            <span>Subscribe</span>
          </Button>
        }
        modalContent={() => <WritingSubscriptionForm />}
      />
    )
  }

  function trailingAccessory() {
    return (
      <div className="flex space-x-2">
        {getSubscribeButton()}
        {getAddButton()}
      </div>
    )
  }

  return (
    <TitleBar
      trailingAccessory={trailingAccessory()}
      title="Writing"
      scrollContainerRef={scrollContainerRef}
    />
  )
}
