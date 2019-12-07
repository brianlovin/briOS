import * as React from 'react'
import { ThemeProvider } from 'styled-components';
import useDarkMode from 'use-dark-mode'
import GlobalStyles from '~/components/GlobalStyles';
import { light, dark } from '~/components/Theme';
import Sentry from './Sentry';
import Fathom from './Fathom'
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

  // prevents ssr flash for mismatched dark mode
  if (!mounted) return null

  return (
    <Fathom>
      <Sentry>
      <SEO />
        <ThemeProvider theme={theme}>
          <GlobalStyles.ResetStyles />
          {children}
        </ThemeProvider>
      </Sentry>
    </Fathom>
  );
}
