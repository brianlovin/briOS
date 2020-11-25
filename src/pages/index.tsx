import * as React from 'react'
import Link from 'next/link'
import Page from '~/components/Page'
import { CenteredColumn } from '~/components/Layouts'
import { Timeline } from '~/components/Timeline'

function Home() {
  return (
    <Page>
      <CenteredColumn>
        <div className="flex flex-col space-y-14">
          <div className="flex flex-col space-y-8 md:items-center">
            <p className="text-4xl">👾</p>
            <div className="flex flex-col space-y-4 md:items-center md:text-center">
              <h1>Hey, I’m Brian.</h1>
              <p className="text-2xl">
                I’m a product designer, podcaster, and writer, living in San
                Francisco. I’m currently building native mobile apps at GitHub.
              </p>
            </div>

            <div className="flex space-x-4 md:items-center md:justify-center">
              <Link href="/about" passHref>
                <a>
                  <button className="btn btn-primary btn-large">
                    More about me
                  </button>
                </a>
              </Link>
              <a
                href="https://twitter.com/brian_lovin"
                target="_blank"
                rel="noopener noreferrer"
              >
                <button className="btn btn-large">Follow me on Twitter</button>
              </a>
            </div>

            <Timeline />
          </div>
        </div>
      </CenteredColumn>
    </Page>
  )
}

export default Home
