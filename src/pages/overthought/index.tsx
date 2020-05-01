import * as React from 'react'
import Page, { SectionHeading } from '~/components/Page'
import { H3, LargeSubheading } from '~/components/Typography'
import { Post } from '~/types/graphql'
import OverthoughtSubscribeBox from '~/components/Overthought/Subscribe'
import SEO from '~/components/Overthought/SEO'
import OverthoughtList from '~/components/Overthought/List'
import { getPosts } from '~/graphql/queries/queries'
import { fetcher } from '~/graphql/api'

interface Props {
  data: {
    posts: Post[]
  }
}

function Overthought({ data }: Props) {
  return (
    <Page withHeader>
      <SEO />

      <SectionHeading data-cy="overthought">
        <H3>Overthought</H3>
        <LargeSubheading>
          Overthinking out loud about design, development, and building
          products.
        </LargeSubheading>

        {data && data.posts && <OverthoughtList posts={data.posts} />}

        <OverthoughtSubscribeBox />
      </SectionHeading>
    </Page>
  )
}

export async function getStaticProps() {
  const data = await fetcher({ query: getPosts })
  return { props: { data }, unstable_revalidate: true }
}

export default Overthought
