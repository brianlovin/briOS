import * as React from 'react'
import { Coffee } from 'react-feather'
import { Year2020 } from './2020'
import { Year2021 } from './2021'
import { Year2022 } from './2022'
import { TimelineEntry } from './Entry'

export function Timeline() {
  return (
    <div className="flex flex-col w-full timeline-container">
      <Year2022 />
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
