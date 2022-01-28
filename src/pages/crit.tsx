import { NextSeo } from 'next-seo'
import * as React from 'react'

import { Crit } from '~/components/Crit'
import { ListDetailView } from '~/components/Layouts'
import routes from '~/config/routes'

export default function CritPage() {
  return (
    <>
      <NextSeo
        title={routes.crit.seo.title}
        description={routes.crit.seo.description}
        openGraph={routes.crit.seo.openGraph}
      />

      <ListDetailView list={null} hasDetail detail={<Crit />} />
    </>
  )
}
