import * as React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { GitCommit, GitMerge, Zap, Wind, Twitter, Camera } from 'react-feather'
import { ButtonSet, DateEntry, Notes, TimelineEntry } from '../Entry'
import { BlogPost } from '../BlogPost'

export function January() {
  return (
    <>
      <DateEntry title="January, 2020" />

      <TimelineEntry
        title="Social Network Analysis"
        timestamp="January 29, 2020"
        Icon={Zap}
        tint="purple"
      >
        <div className="flex flex-col overflow-hidden transition-shadow bg-white rounded-md shadow md:flex-row dark:bg-gray-900 hover:shadow-cardHover">
          <div className="flex flex-col justify-start px-3 py-3 space-y-2 md:w-1/2">
            <p className="flex-1 px-2 font-normal">
              I conducted a social network analysis to understand the structural
              properties of networks on twitter. I used tweepy to test and
              integrate with twitter’s REST and Streaming APIs.
            </p>
            <span />
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://towardsdatascience.com/mining-twitter-data-ba4e44e6aecc"
            >
              <div className="btn">
                <span>Read technical report</span>
              </div>
            </a>
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://github.com/paulowe/mining-twitter"
            >
              <div className="btn">
                <GitMerge size={16} />
                <span>View project on Github</span>
              </div>
            </a>
          </div>
          <div className="hidden w-full md:w-1/2 md:inline-block">
            <Image
              width="640"
              height="698"
              layout="responsive"
              src="/static/img/project/twitter.png"
              alt="preview of waves, a custom made set of phone wallpapers"
            />
          </div>
        </div>
      </TimelineEntry>
    </>
  )
}
