import * as React from 'react'
import { Zap } from 'react-feather'
import Image from 'next/image'
import { DateEntry, TimelineEntry } from '../Entry'

export function March() {
  return (
    <>
      <DateEntry title="March, 2020" />
      <TimelineEntry
        title="Co-found PharmAssess Diagnostics Corp."
        timestamp="March 6, 2020"
        Icon={Zap}
        tint={'green'}
        divider={true}
      >
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://pharmassess.ca"
        >
          <div className="flex flex-col overflow-hidden transition-shadow bg-white rounded-md shadow md:flex-row dark:bg-gray-900 hover:shadow-cardHover">
            <div className="flex flex-col justify-center px-3 py-3 space-y-1 md:items-center">
              <h5 className="px-2 pt-2">PharmAssess Diagnostics Corp.</h5>
              <p className="flex-1 px-2 font-normal md:text-center">
                Software solutions that empower pharmacists to take hold of
                their expanding scope of care.
              </p>
              <p className="flex-1 px-2 py-4 text-xs font-normal tracking-wider text-gray-700 uppercase dark:text-gray-300 md:text-center">
                Coming January, 2021.
              </p>
              <span />
              <div className="btn btn-primary">View the project</div>
            </div>
          </div>
        </a>
      </TimelineEntry>
    </>
  )
}
