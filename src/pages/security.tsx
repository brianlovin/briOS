import * as React from 'react'
import { NextSeo } from 'next-seo'
import Page, { PageHeader } from '~/components/Page'
import { CenteredColumn } from '~/components/Layouts'
import SecurityChecklist from '~/components/SecurityChecklist'

export default function Security() {
  return (
    <Page>
      <NextSeo
        title={'Security Checklist'}
        description={'Tools and resources for staying safe on the internet'}
        openGraph={{
          url: 'https://brianlovin.com/security',
          title: 'Security Checklist',
          description: 'Tools and resources for staying safe on the internet',
          site_name: 'Security Checklist',
          images: [
            {
              url: 'https://brianlovin.com/static/meta/security.png',
              alt: 'Security Checklist',
            },
          ],
        }}
      />

      <CenteredColumn>
        <div className="flex flex-col space-y-8">
          <PageHeader
            title="Security Checklist"
            subtitle="Tools and resources designed to improve your online privacy,
              safety, and security."
          />

          <SecurityChecklist />
        </div>
      </CenteredColumn>
    </Page>
  )
}
