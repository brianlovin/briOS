import { NextSeo } from 'next-seo'
import * as React from 'react'

import { ListDetailView } from '~/components/Layouts'
import { ConsentForm } from '~/components/SMS/ConsentForm'
import routes from '~/config/routes'

export default function SmsConsentPage() {
  return (
    <>
      <NextSeo
        title={routes.sms.seo.title}
        description={routes.sms.seo.description}
        openGraph={routes.sms.seo.openGraph}
      />

      <ListDetailView list={null} hasDetail detail={<ConsentForm />} />
    </>
  )
}
