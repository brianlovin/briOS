import * as React from 'react'
import Page, { PageHeader } from '~/components/Page'
import { Post } from '~/graphql/types.generated'
import OverthoughtSubscribeBox from '~/components/Ghost/Subscribe'
import SEO from '~/components/Ghost/SEO'
import OverthoughtList from '~/components/Ghost/List'
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
    <Page data-cy="overthought">
      <SEO />

      <CenteredColumn>
        <div className="flex flex-col space-y-14">
          <PageHeader
            title=" Paul's Message "
            subtitle="Thoughts, stories and ideas."
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
