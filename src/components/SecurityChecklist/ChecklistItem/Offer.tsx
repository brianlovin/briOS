import * as React from 'react'
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
      className="flex items-center px-4 py-2 mt-3 space-x-3 text-center highlight-link "
    >
      <p className="pl-2 text-sm font-medium">{offer.label}</p>
    </a>
  )
}
