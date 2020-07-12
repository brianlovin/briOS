import * as React from 'react'
import { NextSeo } from 'next-seo'
import Page from '~/components/Page'
import { H3, Subheading } from '~/components/Typography'
import DesignDetailsGrid from '~/components/DesignDetailsGrid'
import { summaries } from '~/data/appDissections'
import { CenteredColumn } from '~/components/Layouts'
import Flex from '~/components/Flex'

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
        <Flex flexDirection="column" gap={32}>
          <Flex flexDirection="column" gap={24}>
            <H3>App Dissection</H3>
            <Subheading>
              This collection of posts explores some of the best interaction
              patterns, visual styles, and design decisions of well-known apps.
              Each detail features a video and my commentary on the
              functionality and effectiveness of the interface.
            </Subheading>
          </Flex>

          <DesignDetailsGrid summaries={summaries} />
        </Flex>
      </CenteredColumn>
    </Page>
  )
}
