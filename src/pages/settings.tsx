import { NextSeo } from 'next-seo'
import * as React from 'react'

import { ListDetailView } from '~/components/Layouts'
import { UserSettings } from '~/components/UserSettings'
import routes from '~/config/routes'

export default function Settings() {
  return (
    <>
      <NextSeo
        title={routes.settings.seo.title}
        description={routes.settings.seo.description}
        openGraph={routes.settings.seo.openGraph}
      />
      <ListDetailView list={null} hasDetail detail={<UserSettings />} />
    </>
  )
}
