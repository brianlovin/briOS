import * as React from 'react'
import { NextSeo } from 'next-seo'
import StackList from '~/components/Stack'
import Page, { PageHeader } from '~/components/Page'
import { withApollo } from '~/components/withApollo'
import { CenteredColumn } from '~/components/Layouts'
import Recommendations from '~/components/Stack/Recommendations'
import routes from '~/config/routes'
import Link from 'next/link'

function Stack() {
  return (
    <Page>
      <NextSeo
        title={routes.stack.seo.title}
        description={routes.stack.seo.description}
        openGraph={routes.stack.seo.openGraph}
      />

      <CenteredColumn>
        <div className="space-y-8">
          <Link href="/projects" passHref>
            <a className="leading-snug text-tertiary hover:text-gray-1000 dark:hover:text-gray-100">
              &larr; Projects
            </a>
          </Link>
          <PageHeader
            title="Stack"
            subtitle="My favorite tools and software."
          />
        </div>

        <StackList />

        <div className="p-8 mt-16 -mx-8 space-y-4 bg-yellow-400 border-t border-b border-yellow-300 border-dashed bg-opacity-5 dark:border-gray-800">
          <p className="text-yellow-900 dark:text-gray-100">
            About these links
          </p>
          <p className="text-yellow-700 dark:text-gray-300">
            I only recommend apps and tools that I use every day and think are
            excellent. Nobody is paying to be on this list.
          </p>
          <p className="text-yellow-700 dark:text-gray-300">
            However, some of the links above are affiliate links. If you don’t
            want to click them out of principle, I understand. Any affiliate
            income earned goes straight back into powering this website and my
            other side projects: servers, storage, domain names, and other
            operational costs do add up.
          </p>
          <p className="text-yellow-700 dark:text-gray-300">❤️ Brian</p>
        </div>
        <Recommendations />
      </CenteredColumn>
    </Page>
  )
}

export default withApollo(Stack)
