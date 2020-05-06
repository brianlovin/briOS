import * as React from 'react'
import Link from 'next/link'
import { ContentContainer, SectionHeading } from '~/components/Page'
import { H1, Larr, A } from '~/components/Typography'

export default function NotFound() {
  return (
    <ContentContainer data-cy="overthought-not-found">
      <SectionHeading>
        <H1>Post not Found</H1>

        <Link href={'/overthought'} passHref>
          <A>
            <Larr /> Back to Overthought
          </A>
        </Link>
      </SectionHeading>
    </ContentContainer>
  )
}
