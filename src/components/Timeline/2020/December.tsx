import * as React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { GitCommit, GitMerge, Zap, Wind, Twitter, Camera } from 'react-feather'
import { ButtonSet, DateEntry, Notes, TimelineEntry } from '../Entry'
import { BlogPost } from '../BlogPost'

export function December() {
  return (
    <>
      <DateEntry title="December, 2020" />

      <TimelineEntry
        title="CreateDAV Public Seminar Series"
        timestamp="December 16, 2020"
        Icon={Wind}
        tint="blue"
      >
        <div className="flex flex-col overflow-hidden transition-shadow bg-white rounded-md shadow md:flex-row dark:bg-gray-900 hover:shadow-cardHover">
          <div className="flex flex-col justify-start px-3 py-3 space-y-2 md:w-1/2">
            <p className="flex-1 px-2 font-normal">
              As part of the NSERC CREATE Training Program, I attended the
              public seminar delivered by postdoctoral trainee, (and former
              undergraduate teaching assistant) Amin Omidvar where he spoke
              about how to design the last layer of a neural network for various
              supervised machine learning tasks.
            </p>
            <span />
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="static/docs/create-dav.pdf"
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
              src="/static/img/project/bergeron.jpg"
              alt="A preview of the CreateDAV certificate"
            />
          </div>
        </div>
      </TimelineEntry>
    </>
  )
}
