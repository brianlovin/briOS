import * as React from 'react'

import { GlobalNavigationContext } from '~/components/Providers'

export function SidebarOverlay() {
  const { isOpen, setIsOpen } = React.useContext(GlobalNavigationContext)

  return (
    <div
      className={`fixed bg-black bg-opacity-5 dark:bg-opacity-50 transition duration-200 ease-in-out inset-0 z-20 ${
        isOpen
          ? 'opacity-100 pointer-events-auto'
          : 'opacity-0 pointer-events-none'
      }`}
      onClick={() => setIsOpen(false)}
    />
  )
}
