import * as React from 'react'
import { BlogPost } from '../BlogPost'
import { DateEntry, TimelineEntry, Notes } from '../Entry'
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
export function February() {
  return (
    <>
      <DateEntry title="February, 2021" />

      <BlogPost
        image="zero-to-one.jpg"
        timestamp="February 14, 2021"
        slug="zero-to-one"
        title="Zero to One: Notes on Startups, or How to Build the Future"
        description="Personal notes on questions and lessons learnt from Peter Thiel's Zero to One"
        divider={true}
      />

      <TimelineEntry
        title="Re/Invent-ing my website using AWS CloudFront"
        timestamp="February 5, 2021"
        Icon={Plus}
        divider={true}
      >
        <>
          <Notes>
            <p>
              I am currently working towards my{' '}
              <a
                href="https://aws.amazon.com/certification/certified-cloud-practitioner/"
                target="_blank"
                rel="noopener noreferrer"
              >
                AWS Cloud Practioner
              </a>{' '}
              certification through the AWS Re/Invent program.
            </p>
            <p>
              To practice some of the concepts I learn in class, I decided to
              create an Amazon Cloudfront distribution that uses a CloudFront
              domain name to distribute my website&apos;s static assets in S3.
            </p>
          </Notes>
        </>
      </TimelineEntry>
    </>
  )
}
