import * as React from 'react'
import { Coffee } from 'react-feather'
import { Year2020 } from './2020'
import { TimelineEntry } from './Entry'

export function Timeline() {
  return (
    <div className="flex flex-col w-full pt-8 timeline-container">
      <Year2020 />
      <TimelineEntry
        title="Work in progress..."
        timestamp="More timeline entries coming soon"
        Icon={Coffee}
        divider={false}
      />
    </div>
  )
}
