import * as React from 'react'
import { Zap, CheckCircle, Camera, GitCommit } from 'react-feather'
import Image from 'next/image'
import { DateEntry, Notes, TimelineEntry } from '../Entry'

export function March() {
  return (
    <>
      <DateEntry title="Present" />
      <TimelineEntry
        title="Google - BMO Ads, Cloud and Analytics Session"
        timestamp="March 16, 2023"
        Icon={Camera}
      >
        <div className="grid grid-cols-2 grid-rows-2 gap-2">
          <Image
            src="https://d2fl8krjhnb3wd.cloudfront.net/static/photos/analytics-h0.png"
            width="2362"
            height="1772"
            layout="responsive"
            className="rounded"
            alt="Photo from the competition, Toronto"
          />
          <Image
            src="https://d2fl8krjhnb3wd.cloudfront.net/static/photos/analytics-h1.png"
            width="2362"
            height="1772"
            layout="responsive"
            className="rounded"
            alt="Photo from the competition, Toronto"
          />
          <Image
            src="https://d2fl8krjhnb3wd.cloudfront.net/static/photos/analytics-h2.png"
            width="2362"
            height="1772"
            layout="responsive"
            className="rounded"
            alt="Photo from the competition, Toronto"
          />
        </div>
      </TimelineEntry>
      <TimelineEntry
        title="Fine-Grained Visual Categorization of Crops with CropNet CNN"
        timestamp="March 11, 2023"
        Icon={GitCommit}
        tint="red"
      >
        <div className="flex flex-col overflow-hidden transition-shadow bg-white rounded-md shadow md:flex-row dark:bg-gray-900 hover:shadow-cardHover">
          <div className="flex flex-col justify-start px-3 py-3 space-y-2 md:w-1/2">
            <p className="flex-1 px-2 font-normal">
              This notebook guides you through the process of training a deep
              learning Convolutional Neural Network model for image
              classification. The final model is an ensemble that uses 1
              pretrained classifier and 4 feature vectors.
            </p>
            <span />
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="/static/docs/CW2_TzCropNet-Final.html"
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
              src="https://d2fl8krjhnb3wd.cloudfront.net/static/img/project/cropnet.png"
              alt="A preview of the CropNet Methodology"
            />
          </div>
        </div>
      </TimelineEntry>
    </>
  )
}
