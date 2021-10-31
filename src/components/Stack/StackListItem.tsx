import Image from 'next/image'
import * as React from 'react'

import { ListItem } from '~/components/ListDetail/ListItem'

// TODO: Figure out how to get this dynamically
interface Props {
  stack: {
    __typename: 'Stack'
    id: string
    createdAt: string
    updatedAt?: string | null | undefined
    name: string
    description?: string | null | undefined
    url: string
    image?: string | null | undefined
  }
  active: boolean
}

export const StackListItem = React.memo<Props>(({ stack, active }) => {
  function handleClick(e, stack) {
    if (e.metaKey) {
      e.preventDefault()
      e.stopPropagation()
      window.open(stack.url, '_blank').focus()
    }
  }

  return (
    <ListItem
      key={stack.name}
      href="/stack/[id]"
      as={`/stack/${stack.id}`}
      title={stack.name}
      description={null}
      byline={null}
      leadingAccessory={
        <Image
          src={stack.image}
          width={48}
          height={48}
          layout="fixed"
          alt={`${stack.name} icon`}
          className={'rounded-xl'}
        />
      }
      active={active}
      onClick={(e) => handleClick(e, stack)}
    />
  )
})
