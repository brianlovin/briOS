import * as React from 'react'
import Link from 'next/link'
import Page from '~/components/Page'
import { H2, A, Rarr, P, H5 } from '~/components/Typography'
import OverthoughtList from '~/components/Overthought/List'
import DesignDetailsGrid from '~/components/DesignDetailsGrid'
import PodcastEpisodesList from '~/components/PodcastEpisodesList'
import FigmaPlugins from '~/components/FigmaPlugins'
import { GET_HOME } from '~/graphql/queries'
import { Post, Episode, Repo } from '~/graphql/types.generated'
import { initApolloClient } from '~/graphql/services/apollo'
import { summaries } from '~/data/appDissections'
import { DesignDetailsPostSummary } from '~/data/appDissections'
import { CenteredColumn } from '~/components/Layouts'
import Flex from '~/components/Flex'

interface Props {
  data: {
    posts: Post[]
    episodes?: Episode[]
    repos?: Repo[]
  }
  summaries: DesignDetailsPostSummary[]
}

function Home({ data, summaries }: Props) {
  return (
    <Page>
      <CenteredColumn>
        <Flex flexDirection="column" gap={56}>
          <Flex flexDirection="column" gap={16}>
            <H2>✊🏾</H2>
            <H5>Black Lives Matter.</H5>

            <P style={{ lineHeight: 1.8 }}>
              George Floyd, Natosha McDade, Yassin Mohamed, Finan H. Berhe, Sean
              Reed, Steven Demarco Taylor, Breonna Taylor, Ariane McCree,
              Terrance Franklin, Miles Hall, Darius Tarver, William Green,
              Samuel David Mallard, Kwame Jones, De’von Bailey, Christopher
              Whitfield, Anthony Hill, De’Von Bailey, Eric Logan, Jamarion
              Robinson, Gregory Hill Jr, JaQuavion Slaton, Ryan Twyman, Brandon
              Webber, Jimmy Atchison, Willie McCoy, Emantic Fitzgerald Bradford
              J, D’ettrick Griffin, Jemel Roberson, DeAndre Ballard, Botham Shem
              Jean, Robert Lawrence White, Anthony Lamar Smith, Ramarley Graham,
              Manuel Loggins Jr, Trayvon Martin, Wendell Allen, Kendrec McDade,
              Larry Jackson Jr, Jonathan Ferrell, Jordan Baker, Victor White
              III, Dontre Hamilton, Eric Garner, John Crawford III, Michael
              Brown, Ezell Ford, Dante Parker, Kajieme Powell, Laquan McDonald,
              Akai Gurley, Tamir Rice, Rumain Brisbon, Jerame Reid, Charly
              Keunang, Tony Robinson, Walter Scott, Freddie Gray, Brendon Glenn,
              Samuel DuBose, Christian Taylor, Jamar Clark, Mario Woods,
              Quintonio LeGrier, Gregory Gunn, Akiel Denkins, Alton Sterling,
              Philando Castile, Terrence Sterling, Terence Crutcher, Keith
              Lamont Scott, Alfred Olango, Jordan Edwards, Stephon Clark, Danny
              Ray Thomas, DeJuan Guillory, Patrick Harmon, Jonathan Hart,
              Maurice Granton, Julius Johnson, Jamee Johnson, Michael Dean...
            </P>

            <Flex flexDirection="column" gap={4}>
              <A
                href="https://blacklivesmatter.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Black Lives Matter <Rarr />
              </A>

              <A
                href="https://www.naacpldf.org/"
                target="_blank"
                rel="noopener noreferrer"
              >
                NAACP Legal Defense and Educational Fund <Rarr />
              </A>

              <A
                href="https://eji.org/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Equal Justice Initiative <Rarr />
              </A>

              <A
                href="https://www.wetheprotesters.org/"
                target="_blank"
                rel="noopener noreferrer"
              >
                We the Protesters <Rarr />
              </A>

              <A
                href="https://www.reclaimtheblock.org/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Reclaim the Block <Rarr />
              </A>

              <A
                href="https://www.gofundme.com/f/georgefloyd"
                target="_blank"
                rel="noopener noreferrer"
              >
                George Floyd Memorial Fund <Rarr />
              </A>
            </Flex>
          </Flex>
        </Flex>
      </CenteredColumn>
    </Page>
  )
}

export async function getStaticProps() {
  const client = await initApolloClient({})
  const { data } = await client.query({ query: GET_HOME })
  return {
    // because this data is slightly more dynamic, update it every hour
    unstable_revalidate: 60 * 60,
    props: {
      data,
      apolloStaticCache: client.cache.extract(),
      summaries: summaries.slice(0, 4),
    },
  }
}

export default Home
