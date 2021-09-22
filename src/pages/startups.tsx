import * as React from 'react'
import { NextSeo } from 'next-seo'
import JobsList from '~/components/JobsList'
import Page, { PageHeader } from '~/components/Page'
import { CenteredColumn } from '~/components/Layouts'
import routes from '~/config/routes'
import Link from 'next/link'

export default function StartupsPage() {
  return (
    <Page>
      <NextSeo
        title={routes.startupJobs.seo.title}
        description={routes.startupJobs.seo.description}
        openGraph={routes.startupJobs.seo.openGraph}
      />

      <CenteredColumn>
        <div className="space-y-8">
          <Link href="/projects" passHref>
            <a className="leading-snug text-tertiary hover:text-gray-1000 dark:hover:text-gray-100">
              &larr; Projects
            </a>
          </Link>
          <PageHeader
            title="Startup Jobs"
            subtitle={routes.startupJobs.seo.description}
          />
        </div>

        <JobsList />

        <div className="p-8 mt-16 -mx-4 space-y-4 bg-yellow-400 border-t border-b border-yellow-300 border-dashed md:-mx-8 dark:bg-opacity-10 bg-opacity-5 dark:border-gray-800">
          <p className="font-semibold text-yellow-900 dark:text-gray-100">
            About these jobs
          </p>
          <p className="text-yellow-700 dark:text-gray-300">
            This page exclusively lists roles at companies where I'm an advisor
            or have personally invested. The startups listed above do not pay me
            to share open roles here.
          </p>
        </div>
      </CenteredColumn>
    </Page>
  )
}
