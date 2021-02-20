import * as React from 'react'
import Page, { PageHeader } from '~/components/Page'
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
        <div data-cy="overthought" className="flex flex-col space-y-14">
          <PageHeader
            title="Overthought"
            subtitle="Thinking out loud about design, development, and building
              excellent software."
          />

          <OverthoughtSubscribeBox />
          {data && data.posts && <OverthoughtList posts={data.posts} />}
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
