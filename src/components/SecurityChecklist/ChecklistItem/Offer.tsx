import * as React from 'react'
import { Link } from 'react-feather'
import type { Offer } from '../types'

type Props = {
  offer: Offer
}

export default function AppOffer({ offer }: Props) {
  return (
    <a
      href={offer.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center px-4 py-2 mt-3 space-x-3 text-gray-700 border border-gray-200 rounded-md bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 hover:text-gray-1000 dark:hover:text-gray-50"
    >
      <Link size={16} />
      <p className="text-sm font-medium text-tertiary hover:text-gray-1000 dark:hover:text-gray-50">
        {offer.label}
      </p>
    </a>
  )
}
