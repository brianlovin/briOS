import * as React from 'react'
import Page, { PageHeader } from '~/components/Page'
import { CenteredColumn } from '~/components/Layouts'
import Link from 'next/link'
import Button from '~/components/Button'

function MissingPage() {
  return (
    <Page>
      <CenteredColumn>
        <div className="space-y-8">
          <PageHeader
            title="404"
            subtitle="This page doesn’t exist. Try heading back home to start from the beginning."
          />
          <div>
            <Link href="/" passHref>
              <a>
                <Button>Return home</Button>
              </a>
            </Link>
          </div>
        </div>
      </CenteredColumn>
    </Page>
  )
}

export default MissingPage
