import * as React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { GitCommit, GitMerge, Zap, Wind, Twitter, Camera } from 'react-feather'
import { ButtonSet, DateEntry, Notes, TimelineEntry } from '../Entry'
import { BlogPost } from '../BlogPost'

export function April() {
  return (
    <>
      <DateEntry title="April, 2020" />

      <TimelineEntry
        title="KPMG Virtual Internship"
        timestamp="April 25, 2020"
        Icon={Zap}
        tint="blue"
      >
        <div className="flex flex-col overflow-hidden transition-shadow bg-white rounded-md shadow md:flex-row dark:bg-gray-900 hover:shadow-cardHover">
          <div className="flex flex-col justify-start px-3 py-3 space-y-2 md:w-1/2">
            <p className="flex-1 px-2 font-normal">
              I virtually completed my internship with KPMG&apos;s data
              analytics consulting group. As part of the internship program, I
              worked with a business client to complete data quality
              assessments, conduct research in knowledge mining, prepare
              visualization dashboards, and presentations.
            </p>
            <span />
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="static/docs/kpmg.pdf"
            >
              <div className="btn">
                <span>View certificate</span>
              </div>
            </a>
          </div>
          <div className="hidden w-full md:w-1/2 md:inline-block">
            <Image
              width="640"
              height="698"
              layout="responsive"
              src="https://d2fl8krjhnb3wd.cloudfront.net/static/img/project/kpmg.png"
              alt="A preview of the KPMG logo"
            />
          </div>
        </div>
      </TimelineEntry>
    </>
  )
}
