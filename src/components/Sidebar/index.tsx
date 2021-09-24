import * as React from 'react'
import { GlobalNavigationContext } from '../Providers'
import TitleBar from '../ListDetail/TitleBar'
import Image from 'next/image'
import { UserFooter } from './UserFooter'
import { SidebarOverlay } from './Overlay'
import { SidebarNavigation } from './Navigation'

export default function Sidebar() {
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
        } lg:relative flex flex-col lg:translate-x-0 w-56 2xl:w-72 3xl:w-80 h-full z-30 max-h-screen min-h-screen overflow-y-auto transition duration-200 ease-in-out transform bg-white border-r border-gray-150 dark:bg-gray-900 dark:border-gray-800`}
      >
        <TitleBar
          scrollContainerRef={scrollContainerRef}
          leadingAccessory={
            <Image
              src="/static/img/avatar.jpeg"
              width="28"
              height="28"
              layout="fixed"
              className="rounded-full"
            />
          }
          title="Brian Lovin"
        />
        <SidebarNavigation />
        <UserFooter />
      </nav>

      <SidebarOverlay />
    </>
  )
}
