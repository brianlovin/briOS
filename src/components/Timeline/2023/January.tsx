import * as React from 'react'
import { CheckCircle, GitCommit } from 'react-feather'
import { BlogPost } from '../BlogPost'
import { DateEntry, TimelineEntry } from '../Entry'
import Image from 'next/image'

export function January() {
  return (
    <>
      <DateEntry title="January, 2023" />
      <TimelineEntry
        title="Google Cloud Certified"
        timestamp="Jan 2, 2023"
        Icon={CheckCircle}
        tint={'green'}
        divider={true}
      >
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.credential.net/3ccde215-74ab-4924-8846-ca7673a47f7c"
        >
          <div className="flex flex-col overflow-hidden transition-shadow bg-white rounded-md shadow md:flex-row dark:bg-gray-900 hover:shadow-cardHover">
            <div className="flex flex-col justify-center px-3 py-3 space-y-1 md:items-center">
              <h5 className="px-2 pt-2">Professional Data Engineer</h5>
              <p className="flex-1 px-2 font-normal md:text-center">
                A Professional Data Engineer enables data-driven decision making
                by collecting, transforming, and publishing data. A data
                engineer should be able to design, build, operationalize,
                secure, and monitor data processing systems with a particular
                emphasis on security and compliance; scalability and efficiency;
                reliability and fidelity; and flexibility and portability. A
                Data Engineer should also be able to leverage, deploy, and
                continuously train pre-existing machine learning models.
              </p>
              <p className="flex-1 px-2 py-4 text-xs font-normal tracking-wider text-gray-700 uppercase dark:text-gray-300 md:text-center">
                30 Dec, 2022 to 30 Dec, 2024.
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
