import * as React from 'react'
import { IdProvider } from '@radix-ui/react-id'
import { UserProvider } from '@auth0/nextjs-auth0'
import Fathom from './Fathom'
import SEO from './SEO'
import Toast from './Toaster'

interface Props {
  children?: any
}

const globalNavigationContext = {
  isOpen: false,
  setIsOpen: (val: boolean) => {},
}

export const GlobalNavigationContext = React.createContext(
  globalNavigationContext
)

export default function Providers({ children }: Props) {
  function setIsOpen(isOpen) {
    return setState({ ...state, isOpen })
  }

  const initialState = {
    isOpen: false,
    setIsOpen,
  }

  const [state, setState] = React.useState(initialState)

  return (
    <>
      <SEO />
      <Fathom />
      <Toast />

      <UserProvider>
        <IdProvider>
          <GlobalNavigationContext.Provider value={state}>
            {children}
          </GlobalNavigationContext.Provider>
        </IdProvider>
      </UserProvider>
    </>
  )
}
