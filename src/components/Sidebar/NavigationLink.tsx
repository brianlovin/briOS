import * as React from 'react'
import Link from 'next/link'
import { GlobalNavigationContext } from '../Providers'

export default function NavigationLink({
  href,
  label,
  icon: Icon,
  accessory: Accessory,
  isActive,
}) {
  const { setIsOpen } = React.useContext(GlobalNavigationContext)

  return (
    <li onClick={() => setIsOpen(false)}>
      <Link href={href}>
        <a
          className={`flex items-center space-x-3 px-2 py-2 text-sm font-medium rounded-md  ${
            isActive
              ? 'bg-gray-200 text-black hover:bg-gray-200 hover:text-black dark:bg-gray-700 dark:hover:bg-gray-700 dark:text-white dark:hover:text-white'
              : 'text-gray-700 dark:text-gray-200 dark:hover:text-gray-200 hover:text-gray-900 dark:hover:bg-gray-700 hover:bg-gray-200'
          }`}
        >
          <span className="flex items-center justify-center">
            <Icon />
          </span>
          <span className="flex-1">{label}</span>
          {Accessory && (
            <span className="flex items-center justify-center w-4 text-black dark:text-white text-opacity-40">
              <Accessory />
            </span>
          )}
        </a>
      </Link>
    </li>
  )
}
