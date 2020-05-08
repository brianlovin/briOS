import * as React from 'react'
import GlobalStyles from '~/components/GlobalStyles'
import Fathom from './Fathom'
import SEO from './SEO'
import DarkMode from './DarkMode'

interface Props {
  children?: any
}

export default ({ children }: Props) => {
  return (
    <>
      <SEO />
      <DarkMode />
      <Fathom />
      <GlobalStyles.ResetStyles />

      {children}
    </>
  )
}
