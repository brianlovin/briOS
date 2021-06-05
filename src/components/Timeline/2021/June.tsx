import * as React from 'react'
import { Zap, GitCommit, GitMerge } from 'react-feather'
import Image from 'next/image'
import { DateEntry, TimelineEntry } from '../Entry'

export function June() {
  return (
    <>
      <DateEntry title="June, 2021" />
      <TimelineEntry
        title="Mapping FSL Twitter: A visual and technical perspective"
        timestamp="June 05, 2021"
        Icon={GitCommit}
        tint="red"
      >
        <div className="flex flex-col overflow-hidden transition-shadow bg-white rounded-md shadow md:flex-row dark:bg-gray-900 hover:shadow-cardHover">
          <div className="flex flex-col justify-start px-3 py-3 space-y-2 md:w-1/2">
            <p className="flex-1 px-2 font-normal">
              This large-scale project seeks to shed light on the network
              analysis of the FSL twitter network to uncover its characteristics
              and structural properties. A graph processing platform to create a
              dashboard of influential Twitter profiles and a geolocation tool
              are implemented as part of the process
            </p>
            <span />
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://d2fl8krjhnb3wd.cloudfront.net/static/videos/camerise.mp4"
            >
              <div className="btn">
                <span>Watch video</span>
              </div>
            </a>
          </div>
          <div className="hidden w-full md:w-1/2 md:inline-block">
            <Image
              width="640"
              height="698"
              layout="responsive"
              src="https://d2fl8krjhnb3wd.cloudfront.net/static/img/project/camerise-vid.png"
              alt="A preview of the Kmeans Notebook"
            />
          </div>
        </div>
      </TimelineEntry>
    </>
  )
}
