import * as React from 'react'
import Link from 'next/link'
import { StyledA } from './style'

interface Props {
  active: string
}

export default function Navigation(props: Props) {
  const { active } = props

  return (
    <div className="flex space-x-3">
      <Link href="/hn">
        <StyledA active={active === 'top'}>Top</StyledA>
      </Link>
      <Link href="/hn/about">
        <StyledA active={active === 'about'}>About</StyledA>
      </Link>
    </div>
  )
}
