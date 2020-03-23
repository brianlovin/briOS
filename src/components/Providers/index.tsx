import * as React from 'react'
import GlobalStyles from '~/components/GlobalStyles'
import FathomProvider from './Fathom'
import SEO from './SEO'
import DarkMode from './DarkMode'

interface Props {
  children?: any
}

export default ({ children }: Props) => {
  return (
    <FathomProvider>
      <SEO />

      <DarkMode>
        <GlobalStyles.ResetStyles />
        {children}
      </DarkMode>
    </FathomProvider>
  )
}
