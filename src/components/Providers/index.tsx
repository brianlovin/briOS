import * as React from 'react'
import Fathom from './Fathom'
import SEO from './SEO'
import { createClient } from '@liveblocks/client'
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

      <GlobalNavigationContext.Provider value={state}>
        {children}
      </GlobalNavigationContext.Provider>
    </>
  )
}
