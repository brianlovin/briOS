import * as React from 'react'
import Page, { PageHeader } from '~/components/Page'
import AMAQuestions from '~/components/AMAQuestions'
import { CenteredColumn } from '~/components/Layouts'
import { NextSeo } from 'next-seo'
import routes from '~/config/routes'
import Link from 'next/link'

export default function AboutPage() {
  return (
    <Page>
      <NextSeo
        title={routes.ama.seo.title}
        description={routes.ama.seo.description}
        openGraph={routes.ama.seo.openGraph}
      />

      <CenteredColumn>
        <div className="space-y-8">
          <Link href="/projects" passHref>
            <a className="leading-snug text-tertiary hover:text-gray-1000 dark:hover:text-gray-100">
              &larr; Projects
            </a>
          </Link>
          <PageHeader
            title="Ask Me Anything"
            subtitle="Just for fun! Questions will be visible after I’ve answered."
          />
          <AMAQuestions />
        </div>
      </CenteredColumn>
    </Page>
  )
}
