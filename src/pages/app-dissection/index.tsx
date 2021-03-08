import * as React from 'react'
import { NextSeo } from 'next-seo'
import Page, { PageHeader } from '~/components/Page'
import DesignDetailsGrid from '~/components/DesignDetailsGrid'
import { summaries } from '~/data/appDissections'
import { CenteredColumn } from '~/components/Layouts'
import routes from '~/config/routes'
import Link from 'next/link'

export default function DesignDetails() {
  return (
    <Page>
      <NextSeo
        title={routes.appDissection.seo.title}
        description={routes.appDissection.seo.description}
        openGraph={routes.appDissection.seo.openGraph}
      />

      <CenteredColumn>
        <div className="space-y-8 ">
          <Link href="/projects" passHref>
            <a className="leading-snug text-tertiary hover:text-gray-1000 dark:hover:text-gray-100">
              &larr; Projects
            </a>
          </Link>

          <PageHeader
            title="App Dissection"
            subtitle="Exploring the best interaction patterns, visual styles, and design
            decisions of well-known apps."
          />

          <DesignDetailsGrid summaries={summaries} />
        </div>
      </CenteredColumn>
    </Page>
  )
}
