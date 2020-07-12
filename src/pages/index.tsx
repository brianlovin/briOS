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
            <H2>👾</H2>
            <H5>Hey, I’m Brian.</H5>
            <P>
              I’m a product designer, podcaster, and writer, currently living in
              San Francisco. Right now I’m building native mobile apps at
              GitHub.
            </P>

            <Flex flexDirection="column" gap={4}>
              <Link href="/about" as="/about" passHref>
                <A>
                  More about me <Rarr />
                </A>
              </Link>
              <A
                href="https://twitter.com/brian_lovin"
                target="_blank"
                rel="noopener noreferrer"
              >
                @brian_lovin on Twitter <Rarr />
              </A>
            </Flex>
          </Flex>

          <Flex flexDirection="column" gap={16}>
            <H5>Writing</H5>

            <P>
              I like to think out loud about design, development, and building
              products.
            </P>

            {data && data.posts && <OverthoughtList posts={data.posts} />}

            <Flex flexDirection="column" gap={4}>
              <Link href="/overthought" as="/overthought" passHref>
                <A>
                  See all posts <Rarr />
                </A>
              </Link>

              <A
                href="https://overthought.ghost.io/rss/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Subscribe via RSS <Rarr />
              </A>
            </Flex>
          </Flex>

          <Flex flexDirection="column" gap={16}>
            <H5>Fun Projects</H5>
            <P>Little weekend hacks for fun and learning.</P>
            <Flex flexDirection="column" gap={4}>
              <A href="/bookmarks">Bookmarks</A>
              <P>Internet things, saved for later.</P>
            </Flex>

            <Flex flexDirection="column" gap={4}>
              <A href="/ama">AMA</A>
              <P>Ask me anything.</P>
            </Flex>

            <Flex flexDirection="column" gap={4}>
              <A href="/hn">Hacker News</A>
              <P>A better Hacker News.</P>
            </Flex>
          </Flex>

          <Flex flexDirection="column" gap={16}>
            <H5>Design Details Podcast</H5>
            <P>
              Design Details is a weekly conversation about design process and
              culture. I’ve been a co-host on the show for over five years.
            </P>
            {data && data.episodes && (
              <PodcastEpisodesList episodes={data.episodes} />
            )}
            <A
              href="https://designdetails.fm/episodes"
              target="_blank"
              rel="noopener noreferrer"
            >
              See all episodes <Rarr />
            </A>
          </Flex>

          <Flex flexDirection="column" gap={16}>
            <H5>Figma plugins</H5>
            <P>
              There’s a lot of work in the design process that is boring,
              tedious, and repetitive. I like to make plugins to help automate
              it away.
            </P>
            <FigmaPlugins />
            <A
              href="https://figma.com/@brian"
              target="_blank"
              rel="noopener noreferrer"
            >
              See my Figma profile <Rarr />
            </A>
          </Flex>

          <Flex flexDirection="column" gap={16}>
            <H5>Open source work</H5>
            <Flex flexDirection="column" gap={4}>
              <A
                href="https://github.com/specfm/design-details"
                target="_blank"
                rel="noopener noreferrer"
              >
                specfm / design-details
              </A>
              <P>The code that powers designdetails.fm.</P>
            </Flex>

            <Flex flexDirection="column" gap={4}>
              <A
                href="https://github.com/brianlovin/brian-lovin-next"
                target="_blank"
                rel="noopener noreferrer"
              >
                brian-lovin-next
              </A>
              <P>The code that powers this website you’re looking at.</P>
            </Flex>

            <Flex flexDirection="column" gap={4}>
              <A
                href="https://github.com/brianlovin/security-checklist"
                target="_blank"
                rel="noopener noreferrer"
              >
                security-checklist
              </A>
              <P>A checklist for staying safe on the internet.</P>
            </Flex>

            <Flex flexDirection="column" gap={4}>
              <A
                href="https://github.com/withspectrum/spectrum"
                target="_blank"
                rel="noopener noreferrer"
              >
                withspectrum / spectrum
              </A>
              <P>Simple, powerful online communities.</P>
            </Flex>

            <Flex flexDirection="column" gap={4}>
              <A
                href="https://github.com/specfm/spec-next"
                target="_blank"
                rel="noopener noreferrer"
              >
                specfm / spec-next
              </A>
              <P>
                A podcast network to help designers and developers level up.
              </P>
            </Flex>

            <A
              href="https://github.com/brianlovin"
              target="_blank"
              rel="noopener noreferrer"
            >
              Follow me on GitHub <Rarr />
            </A>
          </Flex>

          <Flex flexDirection="column" gap={16}>
            <H5>Speaking and interviews</H5>
            <Flex flexDirection="column" gap={16}>
              <Flex flexDirection="column" gap={4}>
                <A
                  href="https://www.swiftbysundell.com/podcast/67/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Building for open source
                </A>
                <P>
                  Ryan Nystrom and I talk about designing and building the
                  mobile apps at GitHub.
                </P>
              </Flex>

              <Flex flexDirection="column" gap={4}>
                <A
                  href="https://www.youtube.com/watch?v=SyS3h3kmBnY"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Extend what’s possible with Figma Plugins - Figma Config
                </A>
                <P>
                  An exploration into the plugins I built to automate the
                  tedious parts of designing mobile apps at GitHub.
                </P>
              </Flex>

              <Flex flexDirection="column" gap={4}>
                <A
                  href="https://www.youtube.com/watch?v=6MBBTdu8v6E"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Designing with GraphQL - GraphQL Summit
                </A>
                <P>
                  Exploring the possibilities that open up when designers and
                  developers can speak the same language.
                </P>
              </Flex>

              <Flex flexDirection="column" gap={4}>
                <A
                  href="https://interfacelovers.com/interviews/brian-lovin"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Interface Lovers Interview
                </A>
                <P>
                  An interview about how I got into design, my process, and past
                  work.
                </P>
              </Flex>

              <Flex flexDirection="column" gap={4}>
                <A
                  href="https://spec.fm/podcasts/design-details/79352"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Charmander++ – Interviewing ourselves on Design Details
                </A>
                <P>
                  Bryn Jackson and I interviewed each other. Totally humble.
                </P>
              </Flex>

              <Flex flexDirection="column" gap={4}>
                <A
                  href="https://avocode.com/blog/brian-lovin-product-designer-github-interview"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Avocode Interview
                </A>
                <P>
                  An interview where we dig into my work at Buffer, Facebook,
                  Spectrum, and what’s in the works at GitHub.
                </P>
              </Flex>
            </Flex>
          </Flex>

          <Flex flexDirection="column" gap={24}>
            <Flex flexDirection="column" gap={16}>
              <H5>App Dissection</H5>
              <P>
                In-depth explorations of visual and interaction design in
                well-known apps.
              </P>
              <Link href="/design-details" passHref>
                <A>
                  See all posts <Rarr />
                </A>
              </Link>
            </Flex>
            <DesignDetailsGrid summaries={summaries} />
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
