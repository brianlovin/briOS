import * as React from 'react'
import { NextSeo } from 'next-seo'
import { AppDissectionList } from '~/components/AppDissection/AppDissectionList'
import { ListViewOnly } from '~/components/Layouts'
import routes from '~/config/routes'

export default function AppDissectionsPage() {
  return (
    <>
      <NextSeo
        title={routes.appDissection.seo.title}
        description={routes.appDissection.seo.description}
        openGraph={routes.appDissection.seo.openGraph}
      />

      <ListViewOnly list={<AppDissectionList />} />
    </>
  )
}
