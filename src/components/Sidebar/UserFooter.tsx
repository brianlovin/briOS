import Link from 'next/link'
import * as React from 'react'
import { Settings } from 'react-feather'

import { Avatar } from '~/components/Avatar'
import { GhostButton } from '~/components/Button'
import { LoadingSpinner } from '~/components/LoadingSpinner'
import { useViewerQuery } from '~/graphql/types.generated'
import { authik } from '~/lib/authik/client'

import { GlobalNavigationContext } from '../Providers'

function Container(props) {
  return (
    <div
      data-cy="sign-in-button"
      className="sticky bottom-0 z-10 flex items-center justify-between p-2 space-x-3 bg-white border-t filter-blur border-gray-150 bg-opacity-80 dark:border-gray-800 dark:bg-gray-900 dark:bg-opacity-60"
      {...props}
    />
  )
}
