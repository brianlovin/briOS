import Image from 'next/image'
import * as React from 'react'

import { ListItem } from '~/components/ListDetail/ListItem'
import { StackListItemFragment } from '~/graphql/types.generated'

// TODO: Figure out how to get this dynamically
interface Props {
  stack: StackListItemFragment
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
      href="/stack/[slug]"
      as={`/stack/${stack.slug}`}
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
