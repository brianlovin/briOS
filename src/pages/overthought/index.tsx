import * as React from 'react'
import Page from '~/components/Page'
import { H3, LargeSubheading } from '~/components/Typography'
import { Post } from '~/graphql/types.generated'
import OverthoughtSubscribeBox from '~/components/Overthought/Subscribe'
import SEO from '~/components/Overthought/SEO'
import OverthoughtList from '~/components/Overthought/List'
import { GET_POSTS } from '~/graphql/queries'
import { getStaticApolloClient } from '~/graphql/api'
import Grid from '~/components/Grid'

interface Props {
  data: {
    posts: Post[]
  }
}

function Overthought({ data }: Props) {
  return (
    <Page withHeader>
      <SEO />

      <Grid
        columns={'fit-content(640px)'}
        gap={32}
        style={{ justifyContent: 'center' }}
      >
        <Grid gap={16} data-cy="overthought">
          <H3>Overthought</H3>
          <LargeSubheading>
            Overthinking out loud about design, development, and building
            products.
          </LargeSubheading>
        </Grid>

        {data && data.posts && <OverthoughtList posts={data.posts} />}

        <OverthoughtSubscribeBox />
      </Grid>
    </Page>
  )
}

export async function getStaticProps() {
  const client = await getStaticApolloClient()
  const { data } = await client.query({ query: GET_POSTS })
  return {
    props: {
      data,
    },
  }
}

export default Overthought
