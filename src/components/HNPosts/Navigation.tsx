import * as React from 'react'
import Link from 'next/link'
import { StyledA } from './style'
import Flex from '../Flex'

interface Props {
  active: string
}

export default function Navigation(props: Props) {
  const { active } = props

  return (
    <Flex gap={8} columns={'repeat(3, max-content)'}>
      <Link href="/hn">
        <StyledA active={active === 'top'}>Top</StyledA>
      </Link>
      <Link href="/hn/best">
        <StyledA active={active === 'best'}>Best</StyledA>
      </Link>
      <Link href="/hn/about">
        <StyledA active={active === 'about'}>About</StyledA>
      </Link>
    </Flex>
  )
}
