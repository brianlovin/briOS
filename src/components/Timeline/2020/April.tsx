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
        timestamp="April 4, 2020"
        Icon={Zap}
        tint="blue"
      >
        <div className="flex flex-col overflow-hidden transition-shadow bg-white rounded-md shadow md:flex-row dark:bg-gray-900 hover:shadow-cardHover">
          <div className="flex flex-col justify-start px-3 py-3 space-y-2 md:w-1/2">
            <p className="flex-1 px-2 font-normal">
              As part of the program at KPMG, I interacted with business clients
              to complete data quality assessments, knowledge mining and
              presentations.
            </p>
            <span />
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://towardsdatascience.com/mining-twitter-data-ba4e44e6aecc"
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
              src="/static/img/project/kpmg.png"
              alt="A preview of the KPMG logo"
            />
          </div>
        </div>
      </TimelineEntry>
    </>
  )
}
