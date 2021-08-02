import * as React from 'react'
import { Zap, GitCommit, GitMerge, CheckCircle } from 'react-feather'
import Image from 'next/image'
import { DateEntry, TimelineEntry } from '../Entry'

export function May() {
  return (
    <>
      <DateEntry title="May, 2021" />
      <TimelineEntry
        title="Building a k-means clustering model using BigQuery ML"
        timestamp="May 17, 2021"
        Icon={GitCommit}
        tint="red"
      >
        <div className="flex flex-col overflow-hidden transition-shadow bg-white rounded-md shadow md:flex-row dark:bg-gray-900 hover:shadow-cardHover">
          <div className="flex flex-col justify-start px-3 py-3 space-y-2 md:w-1/2">
            <p className="flex-1 px-2 font-normal">
              This notebook guides you through the process of building a k-means
              clustering model for market segmentation using BigQuery ML,
              iterating on the model to develop a version that creates the
              optimal number of clusters, and using cluster analysis evaluation
              methods such as Davies-Bouldin index
            </p>
            <span />
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://github.com/paulowe/bigquery-kmeans/blob/gcp-notebook/kmeans/kmeans.ipynb"
            >
              <div className="btn">
                <span>View Notebook</span>
              </div>
            </a>
          </div>
          <div className="hidden w-full md:w-1/2 md:inline-block">
            <Image
              width="640"
              height="698"
              layout="responsive"
              src="https://d2fl8krjhnb3wd.cloudfront.net/static/img/project/kmeans.png"
              alt="A preview of the Kmeans Notebook"
            />
          </div>
        </div>
      </TimelineEntry>

      <TimelineEntry
        title="Data science tools for knowledge discovery and data mining"
        timestamp="May 16, 2021"
        Icon={GitCommit}
        tint="purple"
      >
        <div className="flex flex-col overflow-hidden transition-shadow bg-white rounded-md shadow md:flex-row dark:bg-gray-900 hover:shadow-cardHover">
          <div className="flex flex-col justify-start px-3 py-3 space-y-2 md:w-1/2">
            <p className="flex-1 px-2 font-normal">
              Walkthrough of how to use Pandas &amp; Matplotlib to analyze and
              answer business questions about efficient advert timings, and
              further uncovering optimization opportunities using association
              rule mining to generate frequent patterns
            </p>
            <span />
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://github.com/paulowe/SalesAnalytics/blob/main/salesAnalysis.ipynb"
            >
              <div className="btn">
                <span>View Notebook</span>
              </div>
            </a>
          </div>
          <div className="hidden w-full md:w-1/2 md:inline-block">
            <Image
              width="640"
              height="698"
              layout="responsive"
              src="https://d2fl8krjhnb3wd.cloudfront.net/static/img/project/salesanalysis.png"
              alt="A preview of the SalesAnalysis Notebook"
            />
          </div>
        </div>
      </TimelineEntry>

      <TimelineEntry
        title="🎊 Graduated from AWS re/Start 🎊"
        timestamp="May 8, 2020"
        Icon={CheckCircle}
        tint={'green'}
        divider={true}
      >
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.credly.com/badges/e7f2e9f0-9208-428c-9d69-e0de77f23849/public_url"
        >
          <div className="flex flex-col overflow-hidden transition-shadow bg-white rounded-md shadow md:flex-row dark:bg-gray-900 hover:shadow-cardHover">
            <div className="flex flex-col justify-center px-3 py-3 space-y-1 md:items-center">
              <h5 className="px-2 pt-2">AWS Cloud Practitioner</h5>
              <p className="flex-1 px-2 font-normal md:text-center">
                Earners of this certification have a fundamental understanding
                of IT services and their uses in the AWS Cloud. They
                demonstrated cloud fluency and foundational AWS knowledge. Badge
                owners are able to identify essential AWS services necessary to
                set up AWS-focused projects.
              </p>
              <p className="flex-1 px-2 py-4 text-xs font-normal tracking-wider text-gray-700 uppercase dark:text-gray-300 md:text-center">
                8 May, 2021 to 8 May, 2024.
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
