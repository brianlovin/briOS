import * as React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Page from '~/components/Page'
import OverthoughtList from '~/components/Overthought/List'
import DesignDetailsGrid from '~/components/DesignDetailsGrid'
import PodcastEpisodesList from '~/components/PodcastEpisodesList'
import FigmaPlugins from '~/components/FigmaPlugins'
import { Post, Episode, Repo } from '~/graphql/types.generated'
import { DesignDetailsPostSummary, summaries } from '~/data/appDissections'
import { CenteredColumn } from '~/components/Layouts'
import { initApolloClient } from '~/graphql/services/apollo'
import { GET_HOME } from '~/graphql/queries'
import { PrimaryButton } from '~/components/Button'

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
        <div className="flex flex-col space-y-14">
          <div className="flex flex-col space-y-4">
            <p className="text-4xl">👾</p>
            <div className="flex flex-col space-y-1">
              <h4>Hey, I’m Brian.</h4>
              <p className="text-lg">
                I’m a product designer, podcaster, and writer, currently living
                in San Francisco. Right now I’m building native mobile apps at
                GitHub.
              </p>
            </div>

            <div className="flex flex-col space-y-1">
              <Link href="/about" as="/about" passHref>
                <a>More about me &rarr;</a>
              </Link>
              <a
                href="https://twitter.com/brian_lovin"
                target="_blank"
                rel="noopener noreferrer"
              >
                @brian_lovin on Twitter &rarr;
              </a>
            </div>
          </div>

          <div className="flex flex-col space-y-4">
            <div className="flex flex-col space-y-1">
              <h4>Writing</h4>

              <p className="text-lg">
                I like to think out loud about design, development, and building
                products.
              </p>
            </div>

            {data && data.posts && <OverthoughtList posts={data.posts} />}

            <div className="flex flex-col space-y-1">
              <Link href="/overthought" as="/overthought" passHref>
                <a>See all posts &rarr;</a>
              </Link>

              <a
                href="https://overthought.ghost.io/rss/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Subscribe via RSS &rarr;
              </a>
            </div>
          </div>

          <div className="flex flex-col space-y-4">
            <div className="flex flex-col space-y-1">
              <h4>Fun Projects</h4>
              <p className="text-lg">
                Little weekend hacks for fun and learning.
              </p>
            </div>

            <div className="flex flex-col space-y-1">
              <a href="/bookmarks">Bookmarks</a>
              <p>Internet things, saved for later.</p>
            </div>
            <div className="flex flex-col space-y-1">
              <a href="/ama">AMA</a>
              <p>Ask me anything.</p>
            </div>
            <div className="flex flex-col space-y-1">
              <a href="/hn">Hacker News</a>
              <p>A better Hacker News.</p>
            </div>

            <div />

            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://gumroad.com/l/waves-premium-phone-wallpapers"
            >
              <div className="flex flex-col overflow-hidden transition-shadow bg-white rounded-lg shadow md:-mx-8 md:flex-row dark:bg-gray-900 hover:shadow-cardHover">
                <div className="flex flex-col justify-start px-6 py-6 space-y-2 md:w-1/2">
                  <h5>Waves</h5>
                  <p className="flex-1 font-normal">
                    A custom-made set of 10 phone wallpapers, each with a unique
                    color palette and design. I spent hours tweaking colors and
                    curves to get everything just right on my device. I think
                    they’re beautiful – I hope you like them, too!
                  </p>
                  <span />
                  <div className="w-full p-2 text-center text-white bg-blue-500 rounded hover:bg-blue-600 dark:hover:bg-blue-400">
                    View the collection
                  </div>
                </div>
                <div className="w-full md:w-1/2">
                  <Image
                    width="640"
                    height="698"
                    layout="responsive"
                    src="/static/img/waves/thumbnail.png"
                    alt="preview of waves, a custom made set of phone wallpapers"
                  />
                </div>
              </div>
            </a>
          </div>

          <div className="flex flex-col space-y-4">
            <div className="flex flex-col space-y-1">
              <h4>Design Details Podcast</h4>
              <p className="text-lg">
                Design Details is a weekly conversation about design process and
                culture. I’ve been a co-host on the show for over five years.
              </p>
            </div>
            {data && data.episodes && (
              <PodcastEpisodesList episodes={data.episodes} />
            )}
            <a
              href="https://designdetails.fm/episodes"
              target="_blank"
              rel="noopener noreferrer"
            >
              See all episodes &rarr;
            </a>
          </div>

          <div className="flex flex-col space-y-4">
            <div className="flex flex-col space-y-1">
              <h4>Figma plugins</h4>
              <p className="text-lg">
                There’s a lot of work in the design process that is boring,
                tedious, and repetitive. I like to make plugins to help automate
                it away.
              </p>
            </div>
            <FigmaPlugins />
            <a
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
                href="https://github.com/specfm/design-details"
                target="_blank"
                rel="noopener noreferrer"
              >
                specfm / design-details
              </a>
              <p>The code that powers designdetails.fm.</p>
            </div>

            <div className="flex flex-col space-y-1">
              <a
                href="https://github.com/brianlovin/brian-lovin-next"
                target="_blank"
                rel="noopener noreferrer"
              >
                brian-lovin-next
              </a>
              <p>The code that powers this website you’re looking at.</p>
            </div>

            <div className="flex flex-col space-y-1">
              <a
                href="https://github.com/brianlovin/security-checklist"
                target="_blank"
                rel="noopener noreferrer"
              >
                security-checklist
              </a>
              <p>A checklist for staying safe on the internet.</p>
            </div>

            <div className="flex flex-col space-y-1">
              <a
                href="https://github.com/withspectrum/spectrum"
                target="_blank"
                rel="noopener noreferrer"
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
            >
              Follow me on GitHub &rarr;
            </a>
          </div>

          <div className="flex flex-col space-y-4">
            <h4>Speaking and interviews</h4>
            <div className="flex flex-col space-y-4">
              <div className="flex flex-col space-y-1">
                <a
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
                  href="https://interfacelovers.com/interviews/brian-lovin"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Interface Lovers Interview
                </a>
                <p>
                  An interview about how I got into design, my process, and past
                  work.
                </p>
              </div>

              <div className="flex flex-col space-y-1">
                <a
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
                  href="https://softwareengineeringdaily.com/2020/07/15/github-mobile-with-brian-lovin-and-ryan-nystrom/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Software Engineering Daily: GitHub Mobile
                </a>
                <p>
                  Ryan and I discuss how we designed and built the first version
                  of GitHub’s mobile apps.
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
              <Link href="/design-details" passHref>
                <a>See all posts &rarr;</a>
              </Link>
            </div>
            <DesignDetailsGrid summaries={summaries} />
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
      summaries: summaries.slice(0, 4),
    },
  }
}

export default Home
