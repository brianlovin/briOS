import Image from 'next/image'
import * as React from 'react'

export function Avatar({ user, src, ...props }) {
  const fallbackUrl = '/static/img/fallback-avatar.png'
  const [srcState, setSrcState] = React.useState(src || fallbackUrl)
  return (
    <Image
      alt={`${user.name || user.username}'s profile photo`}
      src={srcState}
      {...props}
      onError={() => {
        setSrcState(fallbackUrl)
      }}
    />
  )
}
