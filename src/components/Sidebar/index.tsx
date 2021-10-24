import * as React from 'react'

import { TitleBar } from '~/components/ListDetail/TitleBar'
import { GlobalNavigationContext } from '~/components/Providers'

import { SidebarNavigation } from './Navigation'
import { SidebarOverlay } from './Overlay'
import { UserFooter } from './UserFooter'

export function Sidebar() {
  const { isOpen } = React.useContext(GlobalNavigationContext)
  const scrollContainerRef = React.useRef(null)
  return (
    <>
      <nav
        ref={scrollContainerRef}
        className={`${
          isOpen
            ? 'absolute inset-y-0 left-0 translate-x-0 shadow-lg'
            : 'absolute -translate-x-full'
        } lg:relative flex flex-none flex-col lg:translate-x-0 w-1/2 md:w-1/3 lg:w-56 2xl:w-72 3xl:w-80 h-full z-30 lg:z-auto max-h-screen min-h-screen overflow-y-auto transition duration-200 ease-in-out transform bg-white border-r border-gray-150 dark:bg-gray-900 dark:border-gray-800`}
      >
        <TitleBar
          scrollContainerRef={scrollContainerRef}
          leadingAccessory={null}
          title="Brian Lovin"
        />
        <SidebarNavigation />
        <UserFooter />
      </nav>

      <SidebarOverlay />
    </>
  )
}
