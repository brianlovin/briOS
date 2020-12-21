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
              src="/static/img/about.jpg"
              alt={'A photo of me'}
              layout="responsive"
              width="672"
              height="448"
              className="md:rounded-lg"
            />
          </div>
          <div className="flex flex-col space-y-12">
            <div className="flex flex-col prose lg:prose-lg">
              <p>
                👋 I’m a product designer, podcaster, and writer, currently
                living in San Francisco.
              </p>
              <p>
                Right now I’m designing{' '}
                <a
                  href="https://github.com/mobile"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  native mobile apps
                </a>{' '}
                at{' '}
                <a
                  href="https://github.com/brianlovin"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub
                </a>
                . Before GitHub, I co-founded{' '}
                <a
                  href="https://spectrum.chat"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Spectrum
                </a>
                , a platform for large-scale communities to have better public
                conversations. Spectrum was acquired by GitHub in November,
                2018.
              </p>
              <p>
                Before Spectrum I designed payments experiences at Facebook,
                working across Facebook, Messenger, WhatsApp, and Instagram. I
                originally cut my teeth as the first product designer at{' '}
                <a
                  href="https://buffer.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Buffer
                </a>
                .
              </p>
              <p>
                I also co-host the{' '}
                <a
                  href="https://designdetails.fm"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Design Details Podcast
                </a>
                , a weekly conversation about design process and culture. Design
                Details is part of{' '}
                <a
                  href="https://spec.fm"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Spec.fm
                </a>
                , a podcast network for designers and developers, which I
                co-founded in 2015.
              </p>
              <p>
                You can find me on{' '}
                <a
                  href="https://twitter.com/brian_lovin"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Twitter
                </a>{' '}
                where I talk about design and development, or on{' '}
                <a
                  href="https://github.com/brianlovin"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub
                </a>{' '}
                where I’m building in the open, or on{' '}
                <a
                  href="https://figma.com/@brian"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Figma
                </a>{' '}
                where I’m exploring how plugins can automate the tedious parts
                of interface design.
              </p>
              <p>
                <em>
                  Photo by{' '}
                  <a
                    href="https://twitter.com/rxnjmmt"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    @rxnjmmt
                  </a>
                </em>
              </p>
            </div>

            <Divider />

            <div className="flex flex-col space-y-4">
              <div className="flex flex-col space-y-1">
                <h4>Writing</h4>

                <p className="text-lg">
                  Thinking out loud about design, development, and building
                  software.
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
                <Link passHref href="/design-details">
                  <a className="text-blue-600 dark:text-blue-500">
                    App Dissection
                  </a>
                </Link>
                <p>
                  In-depth explorations of visual and interaction design in
                  well-known apps.
                </p>
              </div>
              <div className="flex flex-col space-y-1">
                <Link passHref href="/bookmarks">
                  <a className="text-blue-600 dark:text-blue-500">Bookmarks</a>
                </Link>
                <p>Internet things, saved for later.</p>
              </div>
              <div className="flex flex-col space-y-1">
                <Link passHref href="/ama">
                  <a className="text-blue-600 dark:text-blue-500">AMA</a>
                </Link>
                <p>Ask me anything.</p>
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
                <Link passHref href="/security">
                  <a className="text-blue-600 dark:text-blue-500">
                    Security Checklist
                  </a>
                </Link>
                <p>Tools and resources for staying safe on the internet.</p>
              </div>
              <div className="flex flex-col space-y-1">
                <Link passHref href="/stack">
                  <a className="text-blue-600 dark:text-blue-500">My Stack</a>
                </Link>
                <p>A curated list of my favorite tools and software.</p>
              </div>
              <div className="flex flex-col space-y-1">
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-500"
                  href="https://gumroad.com/l/waves-premium-phone-wallpapers"
                >
                  Waves Phone Wallpapers
                </a>
                <p>
                  A custom-made set of 10 phone wallpapers, each with a unique
                  color palette and design.
                </p>
              </div>
              <div />
            </div>

            <div className="flex flex-col space-y-4">
              <div className="flex flex-col space-y-1">
                <h4>Design Details Podcast</h4>
                <p className="text-lg">
                  A weekly conversation about design process and culture.
                </p>
              </div>
              {data && data.episodes && (
                <PodcastEpisodesList episodes={data.episodes} />
              )}
              <a
                href="https://designdetails.fm/episodes"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-500"
              >
                See all episodes &rarr;
              </a>
            </div>

            <div className="flex flex-col space-y-4">
              <div className="flex flex-col space-y-1">
                <h4>Figma plugins</h4>
                <p className="text-lg">
                  Making the design process less tedious.
                </p>
              </div>
              <FigmaPlugins />
              <a
                className="text-blue-600 dark:text-blue-500"
                href="https://figma.com/@brian"
                target="_blank"
                rel="noopener noreferrer"
              >
                See my Figma profile &rarr;
              </a>
            </div>

            <div className="flex flex-col space-y-4">
              <h4>Open source work</h4>
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
                  href="https://github.com/brianlovin/brian-lovin-next"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-500"
                >
                  brian-lovin-next
                </a>
                <p>The code that powers this website you’re looking at.</p>
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
                href="https://github.com/brianlovin"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-500"
              >
                Follow me on GitHub &rarr;
              </a>
            </div>

            <div className="flex flex-col space-y-4">
              <h4>Speaking and interviews</h4>
              <div className="flex flex-col space-y-4">
                <div className="flex flex-col space-y-1">
                  <a
                    className="text-blue-600 dark:text-blue-500"
                    href="https://www.swiftbysundell.com/podcast/67/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Building for open source
                  </a>
                  <p>
                    Ryan Nystrom and I talk about designing and building the
                    mobile apps at GitHub.
                  </p>
                </div>

                <div className="flex flex-col space-y-1">
                  <a
                    className="text-blue-600 dark:text-blue-500"
                    href="https://www.youtube.com/watch?v=SyS3h3kmBnY"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Extend what’s possible with Figma Plugins - Figma Config
                  </a>
                  <p>
                    An exploration into the plugins I built to automate the
                    tedious parts of designing mobile apps at GitHub.
                  </p>
                </div>

                <div className="flex flex-col space-y-1">
                  <a
                    className="text-blue-600 dark:text-blue-500"
                    href="https://www.youtube.com/watch?v=6MBBTdu8v6E"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Designing with GraphQL - GraphQL Summit
                  </a>
                  <p>
                    Exploring the possibilities that open up when designers and
                    developers can speak the same language.
                  </p>
                </div>

                <div className="flex flex-col space-y-1">
                  <a
                    className="text-blue-600 dark:text-blue-500"
                    href="https://interfacelovers.com/interviews/brian-lovin"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Interface Lovers Interview
                  </a>
                  <p>
                    An interview about how I got into design, my process, and
                    past work.
                  </p>
                </div>

                <div className="flex flex-col space-y-1">
                  <a
                    className="text-blue-600 dark:text-blue-500"
                    href="https://spec.fm/podcasts/design-details/79352"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Charmander++ – Interviewing ourselves on Design Details
                  </a>
                  <p>
                    Bryn Jackson and I interviewed each other. Totally humble.
                  </p>
                </div>

                <div className="flex flex-col space-y-1">
                  <a
                    href="https://avocode.com/blog/brian-lovin-product-designer-github-interview"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Avocode Interview
                  </a>
                  <p>
                    An interview where we dig into my work at Buffer, Facebook,
                    Spectrum, and what’s in the works at GitHub.
                  </p>
                </div>

                <div className="flex flex-col space-y-1">
                  <a
                    className="text-blue-600 dark:text-blue-500"
                    href="https://softwareengineeringdaily.com/2020/07/15/github-mobile-with-brian-lovin-and-ryan-nystrom/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Software Engineering Daily: GitHub Mobile
                  </a>
                  <p>
                    Ryan and I discuss how we designed and built the first
                    version of GitHub’s mobile apps.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col space-y-6">
              <div className="flex flex-col space-y-4">
                <div className="flex flex-col space-y-1">
                  <h4>App Dissection</h4>
                  <p className="text-lg">
                    In-depth explorations of visual and interaction design in
                    well-known apps.
                  </p>
                </div>
              </div>
              <DesignDetailsGrid summaries={summaries} />
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
