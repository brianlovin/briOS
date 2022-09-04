import * as React from 'react'
import { CheckCircle } from 'react-feather'
import { BlogPost } from '../BlogPost'
import { DateEntry, TimelineEntry } from '../Entry'

export function January() {
  return (
    <>
      <DateEntry title="January, 2022" />
      <TimelineEntry
        title="🎊 Became Google Cloud Certified 🎊"
        timestamp="Jan 8, 2022"
        Icon={CheckCircle}
        tint={'green'}
        divider={true}
      >
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.credential.net/7cec8ff7-d2b0-4a31-baa4-ed4ff116e7c2"
        >
          <div className="flex flex-col overflow-hidden transition-shadow bg-white rounded-md shadow md:flex-row dark:bg-gray-900 hover:shadow-cardHover">
            <div className="flex flex-col justify-center px-3 py-3 space-y-1 md:items-center">
              <h5 className="px-2 pt-2">
                Google Cloud Certified Professional Cloud Architect
              </h5>
              <p className="flex-1 px-2 font-normal md:text-center">
                A Google Cloud Certified - Professional Cloud Architect enables
                organizations to leverage Google Cloud technologies. Through an
                understanding of cloud architecture and Google technology, this
                individual can design, develop, and manage robust, secure,
                scalable, highly available, and dynamic solutions to drive
                business objectives.
              </p>
              <p className="flex-1 px-2 py-4 text-xs font-normal tracking-wider text-gray-700 uppercase dark:text-gray-300 md:text-center">
                7 Jan, 2022 to 7 Jan, 2024.
              </p>
              <span />
              <div className="btn btn-primary">View Certificate</div>
            </div>
          </div>
        </a>
      </TimelineEntry>
    </>
  )
}
