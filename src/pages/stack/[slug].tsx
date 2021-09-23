import * as React from 'react'
import { NextSeo } from 'next-seo'
import routes from '~/config/routes'
import { ListDetailView } from '~/components/Layouts'
import { stackData } from '~/components/Stack/data'
import { StackList } from '~/components/Stack/StackList'
import { StackDetail } from '~/components/Stack/StackDetail'

export default function StackDetailPage({ stack }) {
  if (stack) {
    return (
      <>
        <NextSeo
          title={routes.stack.seo.title}
          description={routes.stack.seo.description}
          openGraph={routes.stack.seo.openGraph}
        />
        <ListDetailView
          list={<StackList />}
          detail={<StackDetail stack={stack} />}
        />
      </>
    )
  }

  return null
}

export async function getStaticPaths() {
  const paths = stackData.map(({ slug }) => ({
    params: { slug },
  }))

  return { paths, fallback: true }
}

export async function getStaticProps({ params: { slug } }) {
  return {
    props: {
      stack: stackData.find((stack) => stack.slug === slug),
    },
  }
}
