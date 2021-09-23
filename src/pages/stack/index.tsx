import * as React from 'react'
import { NextSeo } from 'next-seo'
import { StackList } from '~/components/Stack/StackList'
import routes from '~/config/routes'
import { ListDetailView } from '~/components/Layouts'

export default function StackPage() {
  return (
    <>
      <NextSeo
        title={routes.stack.seo.title}
        description={routes.stack.seo.description}
        openGraph={routes.stack.seo.openGraph}
      />

      <ListDetailView detail={null} list={<StackList />} />
    </>
  )
}
