import * as React from 'react'
import Page from '~/components/Page'
import { Post } from '~/graphql/types.generated'
import OverthoughtSubscribeBox from '~/components/Overthought/Subscribe'
import SEO from '~/components/Overthought/SEO'
import OverthoughtList from '~/components/Overthought/List'
import { GET_POSTS } from '~/graphql/queries'
import { initApolloClient } from '~/graphql/services/apollo'
import { CenteredColumn } from '~/components/Layouts'

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
        <div className="flex flex-col space-y-8">
          <div className="flex flex-col space-y-4" data-cy="overthought">
            <h1>Overthought</h1>
            <p className="page-subtitle">
              Overthinking out loud about design, development, and building
              products.
            </p>
          </div>

          {data && data.posts && <OverthoughtList posts={data.posts} />}

          <OverthoughtSubscribeBox />
        </div>
      </CenteredColumn>
    </Page>
  )
}

export async function getStaticProps() {
  const client = await initApolloClient({})
  const { data } = await client.query({ query: GET_POSTS })
  return {
    // because this data is slightly more dynamic, update it every hour
    revalidate: 60 * 60,
    props: {
      data,
    },
  }
}

export default Overthought
