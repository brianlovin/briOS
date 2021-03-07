import * as React from 'react'
import { Coffee } from 'react-feather'
import { Year2020 } from './2020'
import { Year2021 } from './2021'
import { TimelineEntry } from './Entry'

export function Timeline() {
  return (
    <div className="w-full timeline-container">
      <h4 className="font-list-heading">Changelog</h4>
      <Year2021 />
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
