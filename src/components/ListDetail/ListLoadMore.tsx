import * as React from 'react'
import ReactVisibilitySensor from 'react-visibility-sensor'

import { LoadingSpinner } from '../LoadingSpinner'

export function ListLoadMore({ setIsVisible }) {
  return (
    <ReactVisibilitySensor
      partialVisibility
      onChange={(visible: boolean) => setIsVisible(visible)}
    >
      <div className="flex items-center justify-center w-full p-4">
        <LoadingSpinner />
      </div>
    </ReactVisibilitySensor>
  )
}
