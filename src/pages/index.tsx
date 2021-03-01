import * as React from 'react'
import Link from 'next/link'
import Page, { PageHeader } from '~/components/Page'
import { CenteredColumn } from '~/components/Layouts'

function Home() {
  return (
    <Page>
      <CenteredColumn>
        <div className=" space-y-24">
          <div className=" space-y-8 md:items-center">
            <PageHeader
              title="Hey, I’m Brian"
              subtitle="I’m a product designer, podcaster, and writer, living in San
                Francisco. I’m currently building native mobile apps at GitHub."
            />

            <div className=" space-y-2 md:space-x-4 md:flex-row md:space-y-0 md:items-center md:justify-center">
              <Link href="/about" passHref>
                <a>
                  <button className="w-full text-lg btn btn-primary btn-large">
                    More about me
                  </button>
                </a>
              </Link>
              <a
                href="https://twitter.com/brian_lovin"
                target="_blank"
                rel="noopener noreferrer"
              >
                <button className="w-full text-lg btn btn-large">
                  Follow me on Twitter
                </button>
              </a>
            </div>
          </div>
        </div>
      </CenteredColumn>
    </Page>
  )
}

export default Home
