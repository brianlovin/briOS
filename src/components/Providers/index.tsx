import * as React from 'react'
import { ThemeProvider } from 'styled-components';
import useDarkMode from 'use-dark-mode'
import GlobalStyles from '../GlobalStyles';
import { light, dark } from '../Theme';
import Sentry from './Sentry';
import Fathom from './Fathom'
import SEO from './SEO'

interface Props {
  children?: any;
}

export default ({ children }: Props) => {
  const { value } = useDarkMode(false)
  const theme = value ? dark : light

  return (
    <Fathom>
      <Sentry>
      <SEO />
        <ThemeProvider theme={theme}>
          {children}
          <GlobalStyles.ResetStyles />
        </ThemeProvider>
      </Sentry>
    </Fathom>
  );
}
