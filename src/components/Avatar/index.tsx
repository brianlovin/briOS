import Image from 'next/image'
import * as React from 'react'

export function Avatar({ user, src, ...props }) {
  const fallbackUrl = '/static/img/fallback-avatar.png'
  const [srcState, setSrcState] = React.useState(src || fallbackUrl)

  // forces avatars to update if the component is in the same place between
  // page loads, e.g. changing between AMA questions, the header avatar should
  // update
  React.useEffect(() => {
    if (src) setSrcState(src)
  }, [src])

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
