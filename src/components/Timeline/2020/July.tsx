import Link from 'next/link'
import * as React from 'react'
import Image from 'next/image'
import {
  GitCommit,
  GitMerge,
  Zap,
  Wind,
  Twitter,
  Camera,
  Plus,
  Layers,
} from 'react-feather'
import { BlogPost } from '../BlogPost'
import { ButtonSet, DateEntry, Notes, TimelineEntry } from '../Entry'

export function July() {
  return (
    <>
      <DateEntry title="July, 2020" />

      <TimelineEntry
        title="AWS Africa region virtual day"
        timestamp="July 9, 2020"
        Icon={Plus}
      >
        <>
          <Notes>
            <p>
              Today I attended the{' '}
              <a
                href="https://pages.awscloud.com/aws-africa-region-virtual-day#form-2"
                target="_blank"
                rel="noopener noreferrer"
              >
                AWS Africa region virtual day
              </a>
              , where Dr. Werner Vogels, CTO, Amazon.com, and Michael Kogeler,
              Sub-Saharan Africa General Manager, spoke about the AWS Africa
              Region, customers and partners in the market.
            </p>
            <p>
              Following the keynote, I participated in 4 breakout sessions
              within the technical track which covered building advanced
              architectures and modern app development with the cloud.
            </p>
          </Notes>
          <ButtonSet>
            <a
              href="static/docs/aws-africa.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="btn"
            >
              View certificate
            </a>
          </ButtonSet>
        </>
      </TimelineEntry>

      <TimelineEntry
        title="Maps4Resources"
        timestamp="July 4, 2020"
        Icon={Zap}
        tint="blue"
        divider={true}
      >
        <div className="flex flex-col overflow-hidden transition-shadow bg-white rounded-md shadow md:flex-row dark:bg-gray-900 hover:shadow-cardHover">
          <div className="flex flex-col justify-start px-3 py-3 space-y-2 md:w-1/2">
            <p className="flex-1 px-2 font-normal">
              As part of the 76 projects funded by the Academic Innovation Fund
              (AIF) at York University, I adapted UPenn&apos;s open source flask
              application to display location-based open educational resources
              on a map.
            </p>
            <span />
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://github.com/paulowe/maps4resources"
            >
              <div className="btn">
                <GitMerge size={16} />
                <span>View project on Github</span>
              </div>
            </a>
            <a
              href="https://www.yorku.ca/avptl/academic-innovation-fund/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn"
            >
              Learn more about the AIF
            </a>
          </div>
          <div className="hidden w-full md:w-1/2 md:inline-block">
            <Image
              width="640"
              height="698"
              layout="responsive"
              src="https://d2fl8krjhnb3wd.cloudfront.net/static/img/project/map.png"
              alt="A preview of the maps4resources logo"
            />
          </div>
        </div>
      </TimelineEntry>
    </>
  )
}
