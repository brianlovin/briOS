import * as React from 'react'
import ReactVisibilitySensor from 'react-visibility-sensor'

import { LoadingSpinner } from '../LoadingSpinner'

export function ListLoadMore({ setIsVisible }) {
  return (
    <ReactVisibilitySensor
      partialVisibility
      onChange={(visible: boolean) => setIsVisible(visible)}
    >
      <div className="flex w-full items-center justify-center p-4">
        <LoadingSpinner />
      </div>
    </ReactVisibilitySensor>
  )
}
