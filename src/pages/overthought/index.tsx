import * as React from 'react'
import Page, { SectionHeading } from '~/components/Page'
import { H3, LargeSubheading } from '~/components/Typography'
import { Post } from '~/graphql/types.generated'
import OverthoughtSubscribeBox from '~/components/Overthought/Subscribe'
import SEO from '~/components/Overthought/SEO'
import OverthoughtList from '~/components/Overthought/List'
import { getPosts } from '~/graphql/queries'
import { getStaticApolloClient } from '~/graphql/api'

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
  const client = await getStaticApolloClient()
  const { data } = await client.query({ query: getPosts })
  return {
    props: {
      data,
      apolloStaticCache: client.cache.extract(),
    },
  }
}

export default Overthought
