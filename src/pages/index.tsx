import * as React from 'react'
import Link from 'next/link'
import Page, { PageHeader } from '~/components/Page'
import { CenteredColumn } from '~/components/Layouts'
import Button from '~/components/Button'

function Home() {
  return (
    <Page>
      <CenteredColumn>
        <div className="space-y-24 ">
          <div className="space-y-8 md:items-center">
            <PageHeader
              title="Hey, I’m Brian"
              subtitle="I’m a product designer living in San
                Francisco, currently building native mobile apps at GitHub."
            />

            <div className="grid grid-cols-2 gap-4">
              <Link href="/about" passHref>
                <a className="block">
                  <Button className="w-full">More about me</Button>
                </a>
              </Link>
              <a
                href="https://twitter.com/brian_lovin"
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <Button className="w-full">Follow me on Twitter</Button>
              </a>
            </div>
          </div>
        </div>
      </CenteredColumn>
    </Page>
  )
}

export default Home
