import * as React from 'react'
import { ThemeProvider } from 'styled-components';
import useDarkMode from 'use-dark-mode'
import GlobalStyles from '~/components/GlobalStyles';
import { light, dark } from '~/components/Theme';
import FathomProvider from './Fathom'
import SEO from './SEO'

interface Props {
  children?: any;
}

export default ({ children }: Props) => {
  const { value } = useDarkMode(false, { storageKey: null, onChange: null })
  const theme = value ? dark : light

  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const body =
    <FathomProvider>
      <SEO />

      <ThemeProvider theme={theme}>
        <GlobalStyles.ResetStyles />
        {children}
      </ThemeProvider>
    </FathomProvider>

  // prevents ssr flash for mismatched dark mode
  if (!mounted) {
    return (
      <div style={{ visibility: 'hidden' }}>{body}</div>
    )
  }

  return body
}
