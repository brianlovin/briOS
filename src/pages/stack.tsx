import * as React from 'react'
import { NextSeo } from 'next-seo'
import StackList from '~/components/Stack'
import Page, { PageHeader } from '~/components/Page'
import { withApollo } from '~/components/withApollo'
import { CenteredColumn } from '~/components/Layouts'
import { Info } from 'react-feather'
import Recommendations from '~/components/Stack/Recommendations'

function Stack() {
  return (
    <Page>
      <NextSeo
        title={'Stack'}
        description={'My favorite tools and software.'}
        openGraph={{
          url: 'https://paulowe.com/stack',
          title: 'Stack',
          description: 'My favorite tools and software.',
          images: [
            {
              url: 'https://paulowe.com/static/meta/stack.jpeg',
              alt: 'My favorite tools and software.',
            },
          ],
        }}
      />
      <CenteredColumn>
        <PageHeader title="Stack" subtitle="My favorite tools and software." />

        <StackList />

        <div className="flex flex-col p-6 mt-16 space-y-3 bg-yellow-100 rounded-lg dark:bg-gray-900">
          <div className="flex items-center">
            <Info
              size={20}
              className="mr-3 text-yellow-900 dark:text-gray-100"
            />
            <p className="font-semibold text-yellow-900 dark:text-gray-100">
              About these links
            </p>
          </div>
          <p className="font-normal text-yellow-900 dark:text-gray-300">
            I only recommend apps and tools that I use frequently and think are
            excellent. Nobody is paying to be on this list.
          </p>
          <p className="font-normal text-yellow-900 dark:text-gray-300">
            However, some of the links above are affiliate links. Any affiliate
            income earned goes straight back into powering this website and my
            other side projects: servers, storage, domain names, and other
            operational costs.
          </p>
          <p className="font-normal text-yellow-900 dark:text-gray-300">
            ❤️ Paul
          </p>
        </div>
        <Recommendations />
      </CenteredColumn>
    </Page>
  )
}

export default withApollo(Stack)
