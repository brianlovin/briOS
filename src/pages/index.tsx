import * as React from 'react'
import Link from 'next/link'
import Page, { PageHeader } from '~/components/Page'
import { CenteredColumn } from '~/components/Layouts'
import { Timeline } from '~/components/Timeline'

function Home() {
  return (
    <Page>
      <CenteredColumn>
        <div className="flex flex-col space-y-24">
          <div className="flex flex-col space-y-8 md:items-center">
            <PageHeader
              title="Paul Owe"
              subtitle="is a professional architect on the Google Cloud Platform, building and deploying reliable big data services."
            />

            <div className="flex flex-col space-y-2 md:space-x-4 md:flex-row md:space-y-0 md:items-center md:justify-center">
              <Link href="/about" passHref>
                <a>
                  <button className="w-full text-lg btn btn-primary btn-large">
                    More about me
                  </button>
                </a>
              </Link>
              <a
                href="https://github.com/paulowe"
                target="_blank"
                rel="noopener noreferrer"
              >
                <button className="w-full text-lg btn btn-large">
                  Follow me on GitHub
                </button>
              </a>
            </div>
          </div>

          <Timeline />
        </div>
      </CenteredColumn>
    </Page>
  )
}

export default Home
