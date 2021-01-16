import * as React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Page from '~/components/Page'
import { CenteredColumn } from '~/components/Layouts'
import OverthoughtList from '~/components/Overthought/List'
import DesignDetailsGrid from '~/components/DesignDetailsGrid'
import PodcastEpisodesList from '~/components/PodcastEpisodesList'
import FigmaPlugins from '~/components/FigmaPlugins'
import { initApolloClient } from '~/graphql/services/apollo'
import { GET_HOME } from '~/graphql/queries'
import { Post, Episode, Repo } from '~/graphql/types.generated'
import { DesignDetailsPostSummary, summaries } from '~/data/appDissections'
import Divider from '~/components/Divider'

interface Props {
  data: {
    posts: Post[]
    episodes?: Episode[]
    repos?: Repo[]
  }
  summaries: DesignDetailsPostSummary[]
}

function About({ data, summaries }: Props) {
  return (
    <Page>
      <CenteredColumn>
        <div className="flex flex-col space-y-12" data-cy="about-page">
          <div className="-mx-4 -mt-24 md:mt-0 md:-mx-8 ">
            <Image
              src="/static/img/about.png"
              alt={'A photo of me'}
              layout="responsive"
              width="1922"
              height="1430"
              className="md:rounded-lg"
            />
          </div>
          <div className="flex flex-col space-y-12">
            <div className="flex flex-col prose lg:prose-lg">
              <p>
                👋 I’m a machine intelligence developer, researcher, and writer,
                currently living in{' '}
                <a
                  href="http://www.dsm.go.tz"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Dar es Salaam
                </a>
                .
              </p>
              <p>
                I graduated from{' '}
                <a
                  href="https://lassonde.yorku.ca"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Lassonde School of Engineering
                </a>{' '}
                at York University where I studied Computer Science. I enjoy
                working on innovative solutions in the field of data mining and
                machine learning, working towards an impactful and novel
                contribution that accelerates applications of{' '}
                <a
                  href="https://cci.mit.edu"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  collective intellgience
                </a>
                .
              </p>
              <p>
                I currently conduct research at York University. My role as
                research assistant is focused on the automatic retrieval and
                archiving of{' '}
                <a
                  href="https://en.unesco.org/themes/building-knowledge-societies/oer"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  open educational resources
                </a>
                . I work with an interdisciplinary research team to evaluate a
                large number of platforms, analyze trends and patterns from
                data, and develop an open bilingual accelerator.
              </p>

              <p>
                I also co-founded{' '}
                <a
                  href="https://www.pharmassess.ca/about/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  PharmAssess Diagnostics Corp.
                </a>
                , where I develop algorithms and systems to mine massive of
                data, and create real-time inference engines that are being used
                to provide better healthcare to Canadians.
              </p>
              <p>
                You can find me on{' '}
                <a
                  href="https://github.com/paulowe"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub
                </a>{' '}
                where I’m building in the open, or on{' '}
                <a
                  href="https://www.linkedin.com/in/paulowe"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  LinkedIn
                </a>{' '}
                for professional networking.
              </p>
            </div>

            <Divider />

            <div className="flex flex-col space-y-4">
              <div className="flex flex-col space-y-1">
                <h4>Writing</h4>

                <p className="text-lg">
                  Thinking out loud about design, development, and building
                  intelligent software.
                </p>
              </div>

              {data && data.posts && <OverthoughtList posts={data.posts} />}

              <div className="flex flex-col space-y-1">
                <Link href="/overthought" as="/overthought" passHref>
                  <a className="text-blue-600 dark:text-blue-500">
                    See all posts &rarr;
                  </a>
                </Link>

                <a
                  href="https://overthought.ghost.io/rss/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-500"
                >
                  Subscribe via RSS &rarr;
                </a>
              </div>
            </div>

            <div className="flex flex-col space-y-4">
              <div className="flex flex-col space-y-1">
                <h4>Projects</h4>
                <p className="text-lg">Weekend hacks for fun and learning.</p>
              </div>
              <div className="flex flex-col space-y-1">
                <Link passHref href="/hn">
                  <a className="text-blue-600 dark:text-blue-500">
                    Hacker News
                  </a>
                </Link>
                <p>A better Hacker News.</p>
              </div>
              <div className="flex flex-col space-y-1">
                <Link passHref href="/stack">
                  <a className="text-blue-600 dark:text-blue-500">My Stack</a>
                </Link>
                <p>A curated list of my favorite tools and software.</p>
              </div>
              <div className="flex flex-col space-y-1">
                <Link passHref href="/security">
                  <a className="text-blue-600 dark:text-blue-500">
                    Security Checklist
                  </a>
                </Link>
                <p>Tools and resources for staying safe on the internet.</p>
              </div>
              <div className="flex flex-col space-y-1">
                <Link passHref href="/bookmarks">
                  <a className="text-blue-600 dark:text-blue-500">Bookmarks</a>
                </Link>
                <p>Internet things, saved for later.</p>
              </div>
              <div />
            </div>

            <div className="flex flex-col space-y-4">
              <h4>Open source work</h4>
              <div className="flex flex-col space-y-1">
                <a
                  href="https://github.com/paulowe/paulowe"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-500"
                >
                  paulowe / paulowe
                </a>
                <p>The code that powers this website you’re looking at.</p>
              </div>

              <div className="flex flex-col space-y-1">
                <a
                  className="text-blue-600 dark:text-blue-500"
                  href="https://github.com/designdetails/designdetails"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  designdetails / designdetails
                </a>
                <p>The code that powers Design Details.</p>
              </div>

              <div className="flex flex-col space-y-1">
                <a
                  href="https://github.com/withspectrum/spectrum"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-500"
                >
                  withspectrum / spectrum
                </a>
                <p>Simple, powerful online communities.</p>
              </div>

              <div className="flex flex-col space-y-1">
                <a
                  href="https://github.com/specfm/spec-next"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-500"
                >
                  specfm / spec-next
                </a>
                <p>
                  A podcast network to help designers and developers level up.
                </p>
              </div>

              <a
                href="https://github.com/paulowe"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-500"
              >
                Follow me on GitHub &rarr;
              </a>
            </div>
          </div>
        </div>
      </CenteredColumn>
    </Page>
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
      summaries,
    },
  }
}

export default About
