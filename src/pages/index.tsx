import * as React from 'react'
import { initApolloClient } from '~/graphql/services/apollo'
import { GET_HOME } from '~/graphql/queries'
import { Episode, Post } from '~/graphql/types.generated'
import Intro from '~/components/Home/Intro'
import { DetailViewOnly } from '~/components/Layouts'

interface Props {
  data: {
    episodes: Episode[]
    recent: Post[]
    popular: Post[]
  }
}

function Home({ data }: Props) {
  return (
    <DetailViewOnly>
      <Intro />
    </DetailViewOnly>
  )
}

export async function getStaticProps() {
  const client = await initApolloClient({})
  const { data } = await client.query({ query: GET_HOME })
  return {
    // because this data is slightly more dynamic, update it every hour
    revalidate: 60 * 60,
    props: {
      data,
      apolloStaticCache: client.cache.extract(),
    },
  }
}

export default Home
