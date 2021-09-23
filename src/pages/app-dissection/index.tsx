import * as React from 'react'
import { NextSeo } from 'next-seo'
import { AppDissectionList } from '~/components/AppDissection/AppDissectionList'
import routes from '~/config/routes'
import { ListDetailView } from '~/components/Layouts'

export default function AppDissectionsPage() {
  return (
    <>
      <NextSeo
        title={routes.appDissection.seo.title}
        description={routes.appDissection.seo.description}
        openGraph={routes.appDissection.seo.openGraph}
      />

      <ListDetailView detail={null} list={<AppDissectionList />} />
    </>
  )
}
