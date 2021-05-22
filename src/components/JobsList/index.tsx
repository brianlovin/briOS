import * as React from 'react'
import Image from 'next/image'
import { startupJobs as data } from '~/data/startups'
import Button from '../Button'
import { MarkdownRenderer } from '../MarkdownRenderer'
import Linkify from '../Linkify'

export default function JobsList() {
  const sorted = data.sort(function (a, b) {
    if (a.name.toLowerCase() < b.name.toLowerCase()) return -1
    if (a.name.toLowerCase() > b.name.toLowerCase()) return 1
    return 0
  })

  return (
    <div className="mt-8">
      {sorted.map((job) => {
        return (
          <div
            className="flex py-4 bg-gray-400 bg-opacity-0 rounded md:-mx-4 sm:p-4 sm:py-6"
            key={job.name}
          >
            <a href={job.siteUrl}>
              <Image
                src={`/static/img/startups/${job.logo}`}
                width={64}
                height={64}
                layout="fixed"
                alt={`${job.name} logo`}
                className="rounded-xl flex-0 dark:bg-gray-800"
              />
            </a>

            <div className="justify-center flex-1 col-span-3 pl-5 space-y-2 ">
              <div className="space-y-1 ">
                <a href={job.siteUrl} className="font-medium text-primary">
                  {job.name}
                </a>
                <p className="text-base font-normal prose">
                  <Linkify>{job.description}</Linkify>
                </p>
                <div className="flex pt-3 space-x-3">
                  <a href={job.applicationUrl}>
                    <Button>Get in touch</Button>
                  </a>
                  <a href={job.siteUrl}>
                    <Button>View site</Button>
                  </a>
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
