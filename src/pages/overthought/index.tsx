import * as React from 'react'
import Page from '~/components/Page'
import { H3, LargeSubheading } from '~/components/Typography'
import { Post } from '~/graphql/types.generated'
import OverthoughtSubscribeBox from '~/components/Overthought/Subscribe'
import SEO from '~/components/Overthought/SEO'
import OverthoughtList from '~/components/Overthought/List'
import { GET_POSTS } from '~/graphql/queries'
import { initApolloClient } from '~/graphql/services/apollo'
import { CenteredColumn } from '~/components/Layouts'
import Flex from '~/components/Flex'

interface Props {
  data: {
    posts: Post[]
  }
}

function Overthought({ data }: Props) {
  return (
    <Page>
      <SEO />

      <CenteredColumn>
        <Flex flexDirection="column" gap={32}>
          <Flex flexDirection="column" gap={16} data-cy="overthought">
            <H3>Overthought</H3>
            <LargeSubheading>
              Overthinking out loud about design, development, and building
              products.
            </LargeSubheading>
          </Flex>

          {data && data.posts && <OverthoughtList posts={data.posts} />}

          <OverthoughtSubscribeBox />
        </Flex>
      </CenteredColumn>
    </Page>
  )
}

export async function getStaticProps() {
  const client = await initApolloClient({})
  const { data } = await client.query({ query: GET_POSTS })
  return {
    // because this data is slightly more dynamic, update it every hour
    unstable_revalidate: 60 * 60,
    props: {
      data,
    },
  }
}

export default Overthought
