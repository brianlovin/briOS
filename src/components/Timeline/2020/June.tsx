import * as React from 'react'
import { Zap, CheckCircle } from 'react-feather'
import Image from 'next/image'
import { DateEntry, TimelineEntry } from '../Entry'

export function June() {
  return (
    <>
      <DateEntry title="June, 2020" />
      <TimelineEntry
        title="🎊 Graduated from York University 🎊 "
        timestamp="June 28, 2020"
        Icon={CheckCircle}
        tint={'green'}
        divider={true}
      >
        <div className="flex flex-col overflow-hidden transition-shadow bg-white rounded-md shadow md:flex-row dark:bg-gray-900 hover:shadow-cardHover">
          <div className="flex flex-col justify-center px-3 py-3 space-y-1 md:items-center">
            <h5 className="px-2 pt-2">Bachelor of Arts</h5>
            <p className="flex-1 px-2 font-normal md:text-center">
              I majored in Computer Science with special interest in data
              mining, databases and machine learning.
            </p>
            <p className="flex-1 px-2 py-4 text-xs font-normal tracking-wider text-gray-700 uppercase dark:text-gray-300 md:text-center">
              June, 2020.
            </p>
            <span />
          </div>
        </div>
      </TimelineEntry>
    </>
  )
}
