import * as React from 'react'
import Fathom from './Fathom'
import SEO from './SEO'

interface Props {
  children?: any
}

export default function Providers({ children }: Props) {
  return (
    <React.Fragment>
      <SEO />
      <Fathom />

      {children}
    </React.Fragment>
  )
}
