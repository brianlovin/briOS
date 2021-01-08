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
        description={'In-depth design explorations.'}
        openGraph={{
          url: 'https://brianlovin.com/design-details',
          title: 'Research',
          description: 'In-depth design explorations.',
          site_name: 'Research',
          images: [
            {
              url: 'https://brianlovin.com/static/meta/app-dissection.png',
              alt: 'Research',
            },
          ],
        }}
      />

      <CenteredColumn>
        <div className="flex flex-col space-y-8">
          <PageHeader
            title="Research"
            subtitle="Exploring the best interaction patterns, visual styles, and design
            decisions of intelligent software platforms."
          />

          <DesignDetailsGrid summaries={summaries} />
        </div>
      </CenteredColumn>
    </Page>
  )
}
