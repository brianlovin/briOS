import * as React from 'react'
import Fathom from './Fathom'
import SEO from './SEO'
import { createClient } from '@liveblocks/client'
import { LiveblocksProvider } from '@liveblocks/react'
import Toast from './Toaster'

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
      <Toast />
      {children}
    </>
  )
}
