import Image from 'next/image'
import * as React from 'react'

export function Avatar({ user, src, ...props }) {
  const [srcState, setSrcState] = React.useState(src)
  return (
    <Image
      alt={`${user.name || user.username}'s profile photo`}
      src={srcState}
      {...props}
      onError={() => {
        setSrcState('/static/img/fallback-avatar.png')
      }}
    />
  )
}
