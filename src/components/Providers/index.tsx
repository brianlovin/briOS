import * as React from 'react'
import { ApolloProvider } from '@apollo/client'
import { IdProvider } from '@radix-ui/react-id'
import { UserProvider } from '@auth0/nextjs-auth0'
import Fathom from './Fathom'
import SEO from './SEO'
import Toast from './Toaster'
import { useApollo } from '~/lib/apollo/client'
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

export default function Providers({ children, pageProps }: Props) {
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
        <UserProvider>
          <IdProvider>
            <GlobalNavigationContext.Provider value={state}>
              {children}
            </GlobalNavigationContext.Provider>
          </IdProvider>
        </UserProvider>
      </ApolloProvider>
    </>
  )
}
