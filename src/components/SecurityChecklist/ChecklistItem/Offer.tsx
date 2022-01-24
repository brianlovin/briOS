import * as React from 'react'

import type { Offer } from '../types'

type Props = {
  offer: Offer
}

export function AppOffer({ offer }: Props) {
  return (
    <a
      href={offer.url}
      className="mt-3 flex items-center space-x-3 rounded bg-yellow-50 px-4 py-2 text-center hover:bg-yellow-100 dark:bg-yellow-400 dark:bg-opacity-20 dark:text-yellow-500 dark:hover:bg-yellow-400 dark:hover:bg-opacity-30 dark:hover:text-yellow-400"
    >
      <p className="text-sm font-medium">{offer.label}</p>
    </a>
  )
}
