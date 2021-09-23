import * as React from 'react'
import { NextSeo } from 'next-seo'
import { StackList } from '~/components/Stack/StackList'
import { ListViewOnly } from '~/components/Layouts'
import routes from '~/config/routes'

export default function StackPage() {
  return (
    <>
      <NextSeo
        title={routes.stack.seo.title}
        description={routes.stack.seo.description}
        openGraph={routes.stack.seo.openGraph}
      />

      <ListViewOnly list={<StackList />} />
    </>
  )
}
