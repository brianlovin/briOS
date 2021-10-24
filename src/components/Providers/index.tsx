import * as React from 'react'
import { ApolloProvider } from '@apollo/client'
import { Fathom } from './Fathom'
import { SEO } from './SEO'
import { Toast } from './Toaster'
import { useApollo } from '~/lib/apollo'
import { NextPageContext } from 'next'

interface Props {
  children?: any
  pageProps: NextPageContext
}

const globalNavigationContext = {
  isOpen: false,
  setIsOpen: (val: boolean) => {},
}

export const GlobalNavigationContext = React.createContext(
  globalNavigationContext
)

export function Providers({ children, pageProps }: Props) {
  const apolloClient = useApollo(pageProps)

  const initialState = {
    isOpen: false,
    setIsOpen,
  }

  const [state, setState] = React.useState(initialState)

  function setIsOpen(isOpen) {
    return setState({ ...state, isOpen })
  }

  return (
    <>
      <SEO />
      <Fathom />
      <Toast />

      <ApolloProvider client={apolloClient}>
        <GlobalNavigationContext.Provider value={state}>
          {children}
        </GlobalNavigationContext.Provider>
      </ApolloProvider>
    </>
  )
}
