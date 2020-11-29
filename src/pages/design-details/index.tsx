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
        title={'App Dissection'}
        description={'In-depth design explorations.'}
        openGraph={{
          url: 'https://brianlovin.com/design-details',
          title: 'App Dissection',
          description: 'In-depth design explorations.',
          site_name: 'App Dissection',
          images: [
            {
              url: 'https://brianlovin.com/static/meta/app-dissection.png',
              alt: 'App Dissection',
            },
          ],
        }}
      />

      <CenteredColumn>
        <div className="flex flex-col space-y-8">
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
