import * as React from 'react'
import Image from 'next/image'

export function Avatar({ user, src, ...props }) {
  return (
    <Image
      alt={`${user.name || user.username}'s profile photo`}
      src={src || '/static/img/fallback-avatar.png'}
      {...props}
    />
  )
}
