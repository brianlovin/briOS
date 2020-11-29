import Image from 'next/image'
import * as React from 'react'
import { Camera } from 'react-feather'
import { DateEntry, Notes, TimelineEntry } from '../Entry'

export function October() {
  return (
    <>
      <DateEntry title="October, 2020" />
      <TimelineEntry
        title="Traveled from Colorado to San Francisco"
        timestamp="First week of October"
        Icon={Camera}
      >
        <Notes>
          <p>
            After spending the summer with my family in Colorado, it was time to
            head home. We took a long 2-week route back to San Francisco,
            driving through Salt Lake City, Boise, and Bend. We fell in love
            with Bend and the surrounding area.
          </p>
        </Notes>
        <div className="grid grid-cols-2 grid-rows-2 gap-2">
          <Image
            src="/static/photos/bend-1.jpg"
            width="300"
            height="300"
            layout="responsive"
            className="rounded"
            alt="Photo from around Bend, Oregon"
          />
          <Image
            src="/static/photos/bend-2.jpg"
            width="300"
            height="300"
            layout="responsive"
            className="rounded"
            alt="Photo from around Bend, Oregon"
          />
          <Image
            src="/static/photos/bend-3.jpg"
            width="300"
            height="300"
            layout="responsive"
            className="rounded"
            alt="Photo from around Bend, Oregon"
          />
          <Image
            src="/static/photos/bend-4.jpg"
            width="300"
            height="300"
            layout="responsive"
            className="rounded"
            alt="Photo from around Bend, Oregon"
          />
        </div>
      </TimelineEntry>
    </>
  )
}
