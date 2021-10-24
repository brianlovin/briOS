import * as React from 'react'
import Image from 'next/image'

export function Avatar({ src, ...props }) {
  return <Image src={src || '/static/img/fallback-avatar.png'} {...props} />
}
