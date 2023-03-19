import * as React from 'react'
import { Zap, CheckCircle } from 'react-feather'
import Image from 'next/image'
import { DateEntry, TimelineEntry } from '../Entry'

export function February() {
  return (
    <>
      <DateEntry title="Present" />
      <TimelineEntry
        title="Joined BMO Financial Group"
        timestamp="May 2, 2022"
        Icon={CheckCircle}
        tint={'green'}
        divider={true}
      >
        <div className="flex flex-col overflow-hidden transition-shadow bg-white rounded-md shadow md:flex-row dark:bg-gray-900 hover:shadow-cardHover">
          <div className="flex flex-col justify-center px-3 py-3 space-y-1 md:items-center">
            <h5 className="px-2 pt-2">
              Senior Cloud Engineer, Digital Acquisition
            </h5>
            <p className="flex-1 px-2 font-normal md:text-center">
              Joined BMO as the Google Cloud organization administrator to help
              the digital acquisition team choose the best technologies for
              capturing, ingesting, curating, and leveraging data to create
              unique customer experiences.
            </p>
            <p className="flex-1 px-2 py-4 text-xs font-normal tracking-wider text-gray-700 uppercase dark:text-gray-300 md:text-center">
              May, 2022.
            </p>
            <span />
          </div>
        </div>
      </TimelineEntry>
    </>
  )
}
