import * as React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import routes from '~/config/routes'
import { Menu, X } from 'react-feather'

const defaultRoutes = [
  routes.home,
  routes.about,
  routes.projects,
  routes.writing,
]

export default function Header() {
  const [isExpanded, setIsExpanded] = React.useState(false)
  const router = useRouter()
  const currPathName = router.pathname
  const routesAsArr = Object.keys(routes).map((r) => routes[r])
  const mobileTitle =
    currPathName === '/'
      ? 'Home'
      : routesAsArr
          .filter((r) => r.path !== '/')
          .find((r) => currPathName.includes(r.path)).label

  return (
    <div className="fixed top-0 z-10 w-full py-2 bg-white border-b border-gray-400 border-opacity-30 bg-opacity-70 dark:bg-gray-900 dark:border-gray-800 filter-saturate filter-blur">
      {/* Mobile nav */}
      <div className="grid grid-cols-1 md:hidden">
        <div className="flex items-center pr-4">
          <button
            className="p-4 pl-4 -my-2"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? <X size={16} /> : <Menu size={16} />}
          </button>
          <p className="font-mono text-sm font-semibold clamp-1 text-primary">
            {mobileTitle}
          </p>
        </div>
        {isExpanded && (
          <div className="w-full h-px mt-2 bg-gray-1000 bg-opacity-10" />
        )}
        {isExpanded &&
          defaultRoutes.map((route) => {
            const defaultClasses = `flex items-center pl-12 py-4 font-mono text-sm text-gray-1000 text-opacity-80`

            return (
              <Link href={route.path} key={route.path}>
                <a className={`${defaultClasses}`}>{route.label}</a>
              </Link>
            )
          })}
      </div>
      {/* End mobile nav */}

      {/* Desktop nav */}
      <div className="hidden max-w-screen-md grid-cols-4 gap-1 mx-auto md:grid">
        {defaultRoutes.map((route) => {
          const isActive = route.path === router.pathname
          const defaultClasses = `flex items-center justify-center py-2 font-mono text-sm`
          const activeClasses = `bg-gray-1000 bg-opacity-5 dark:bg-gray-900 text-primary filter-saturate filter-blur`
          const inactiveClasses = ` hover:bg-gray-1000 hover:bg-opacity-5 dark:hover:bg-gray-900 text-gray-1000 text-opacity-40 hover:text-opacity-100`
          return (
            <Link href={route.path} key={route.path}>
              <a
                className={`
                ${defaultClasses} 
                ${isActive ? activeClasses : inactiveClasses}`}
              >
                {route.label}
              </a>
            </Link>
          )
        })}
        {/* End desktop nav */}
      </div>
    </div>
  )
}
