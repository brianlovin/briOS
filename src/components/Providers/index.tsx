import * as React from 'react'
import Fathom from './Fathom'
import SEO from './SEO'
import { createClient } from '@liveblocks/client'
import { LiveblocksProvider } from '@liveblocks/react'

interface Props {
  children?: any
}

const client = createClient({
  authEndpoint: '/api/auth',
})

export default function Providers({ children }: Props) {
  return (
    <>
      <SEO />
      <Fathom />

      {children}
    </>
  )
}
