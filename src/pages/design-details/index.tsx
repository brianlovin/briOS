import * as React from 'react'
import { NextSeo } from 'next-seo'
import Page, { PageHeader } from '~/components/Page'
import DesignDetailsGrid from '~/components/DesignDetailsGrid'
import { summaries } from '~/data/appDissections'
import { CenteredColumn } from '~/components/Layouts'

export default function DesignDetails() {
  return (
    <Page>
      <NextSeo
        title={'Research'}
        description={'In-depth AI explorations.'}
        openGraph={{
          url: 'https://paulowe.com/design-details',
          title: 'AI Research',
          description: 'In-depth AI explorations.',
          site_name: 'AI Research',
          images: [
            {
              url: 'https://paulowe.com/static/meta/app-dissection.png',
              alt: 'Research',
            },
          ],
        }}
      />

      <CenteredColumn>
        <div className="flex flex-col space-y-8">
          <PageHeader
            title="AI Research"
            subtitle="Exploring the best artificially intelligent software platforms. Coming Soon!"
          />
        </div>
      </CenteredColumn>
    </Page>
  )
}
