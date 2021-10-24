import * as React from 'react'
import type { Offer } from '../types'

type Props = {
  offer: Offer
}

export function AppOffer({ offer }: Props) {
  return (
    <a
      href={offer.url}
      className="flex items-center px-4 py-2 mt-3 space-x-3 text-center rounded dark:bg-yellow-400 dark:text-yellow-500 dark:bg-opacity-20 bg-yellow-50 hover:bg-yellow-100 dark:hover:bg-opacity-30 dark:hover:bg-yellow-400 dark:hover:text-yellow-400"
    >
      <p className="text-sm font-medium">{offer.label}</p>
    </a>
  )
}
