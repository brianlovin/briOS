import * as React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { GitCommit, GitMerge, Zap, Wind, Twitter, Camera } from 'react-feather'
import { ButtonSet, DateEntry, Notes, TimelineEntry } from '../Entry'
import { BlogPost } from '../BlogPost'

export function July() {
  return (
    <>
      <DateEntry title="July, 2021" />

      <TimelineEntry
        title="Defining Infrastructure as Code with Terraform"
        timestamp="July 29, 2021"
        Icon={Zap}
        tint="purple"
      >
        <div className="flex flex-col overflow-hidden transition-shadow bg-white rounded-md shadow md:flex-row dark:bg-gray-900 hover:shadow-cardHover">
          <div className="flex flex-col justify-start px-3 py-3 space-y-2 md:w-1/2">
            <p className="flex-1 px-2 font-normal">
              Infrastructure as Code (IaC) provisioning for the DataMaps
              platform on Google Cloud Platform. This Terrafrom template defines
              all networking, compute, and storage components for automating the
              deployment of a loosely-coupled, and highly scalable geolocation
              microservice
            </p>
            <span />
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://github.com/paulowe/terraform-modules"
            >
              <div className="btn">
                <GitMerge size={16} />
                <span>View Terrafrom configuration scripts</span>
              </div>
            </a>
          </div>
          <div className="hidden w-full md:w-1/2 md:inline-block">
            <Image
              width="419"
              height="452"
              layout="responsive"
              src="/static/img/project/Terraform.png"
              alt="Hashicorp Terraform logo"
            />
          </div>
        </div>
      </TimelineEntry>
      <TimelineEntry
        title="TensorFlow on AI Platform for training and model serving "
        timestamp="July 22, 2021"
        Icon={Zap}
        tint="green"
      >
        <Notes>
          <p>
            Implemented an end-to-end solution for building a Tensorflow
            training application, running on a single worker instance in the
            cloud and deploying the model to support requests for{' '}
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://github.com/paulowe/training-data-analyst/tree/master/self-paced-labs/tfx/tfx-ai-platform"
            >
              online predictions on AI platform
            </a>
            .{' '}
          </p>
        </Notes>
        <div className="grid grid-cols-2 grid-rows-1">
          <Image
            src="/static/img/project/gcp_badge1.png"
            width="1072"
            height="1010"
            layout="responsive"
            className="rounded"
            alt="Paul's GCP AI skill badge"
          />
          <Image
            src="/static/img/project/gcp.gif"
            width="300"
            height="300"
            layout="responsive"
            className="rounded"
            alt="A gif of the GCP logo"
          />
        </div>
      </TimelineEntry>
      <TimelineEntry
        title="DataMaps: Complete software specification"
        timestamp="July 14, 2021"
        Icon={Camera}
        tint="blue"
      >
        <div className="flex flex-col overflow-hidden transition-shadow bg-white rounded-md shadow md:flex-row dark:bg-gray-900 hover:shadow-cardHover">
          <div className="flex flex-col justify-start px-3 py-3 space-y-2 md:w-1/2">
            <p className="flex px-2 font-normal">
              This video introduces the DataMaps project and provides a complete
              walkthrough of the Spreadsheet Map list of functionalities such as
              Uploads, Search/Filtering, Ratings, Site administration, and
              application portals for students and faculty.
            </p>
            <span />
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://www.youtube.com/watch?v=OMIljzaZQZc"
            >
              <div className="btn">
                <span>Watch video</span>
              </div>
            </a>
          </div>
          <div className="hidden w-full md:w-1/2 md:inline-block">
            <Image
              width="3000"
              height="2000"
              layout="responsive"
              src="/static/img/project/datamaps.png"
              alt="Paul's Datamaps presentation - July 2021"
            />
          </div>
        </div>
      </TimelineEntry>
    </>
  )
}
