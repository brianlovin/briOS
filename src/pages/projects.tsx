import * as React from 'react'
import Link from 'next/link'
import Page from '~/components/Page'
import { CenteredColumn } from '~/components/Layouts'
import PostsList from '~/components/Writing/List'
import DesignDetailsGrid from '~/components/DesignDetailsGrid'
import PodcastEpisodesList from '~/components/PodcastEpisodesList'
import FigmaPlugins from '~/components/FigmaPlugins'
import { initApolloClient } from '~/graphql/services/apollo'
import { GET_HOME } from '~/graphql/queries'
import { Post, Episode, Repo } from '~/graphql/types.generated'
import { DesignDetailsPostSummary, summaries } from '~/data/appDissections'
import Divider from '~/components/Divider'
import { NextSeo } from 'next-seo'
import routes from '~/config/routes'

interface Props {
  data: {
    posts: Post[]
    episodes?: Episode[]
    repos?: Repo[]
  }
  summaries: DesignDetailsPostSummary[]
}

function Projects({ data, summaries }: Props) {
  return (
    <Page>
      <NextSeo
        title={routes.about.seo.title}
        description={routes.about.seo.description}
        openGraph={routes.about.seo.openGraph}
      />

      <CenteredColumn>
        <div className="flex flex-col space-y-12" data-cy="about-page">
          <div className="flex flex-col space-y-12">
            <div className="flex flex-col space-y-8">
              <div className="flex flex-col space-y-1">
                <h4 className="font-extrabold">Writing</h4>
              </div>

              {data && data.posts && <PostsList posts={data.posts} />}

              <div className="flex flex-col space-y-1">
                <Link href="/writing" as="/writing" passHref>
                  <a className="font-medium text-primary">
                    See all posts &rarr;
                  </a>
                </Link>
              </div>
            </div>

            <Divider />

            <div className="flex flex-col space-y-8">
              <div className="flex flex-col space-y-1">
                <h4 className="text-lg font-bold">Projects</h4>
              </div>

              <div className="flex flex-col space-y-1">
                <span>
                  <Link passHref href="/design-details">
                    <a className="font-medium text-primary highlight-link-hover">
                      App Dissection
                    </a>
                  </Link>
                </span>
                <p className="text-tertiary">
                  In-depth explorations of visual and interaction design in
                  well-known apps.
                </p>
              </div>
              <div className="flex flex-col space-y-1">
                <span>
                  <Link passHref href="/bookmarks">
                    <a className="font-medium text-primary highlight-link-hover">
                      Bookmarks
                    </a>
                  </Link>
                </span>
                <p className="text-tertiary">
                  Internet things, saved for later.
                </p>
              </div>
              <div className="flex flex-col space-y-1">
                <span>
                  <Link passHref href="/ama">
                    <a className="font-medium text-primary highlight-link-hover">
                      AMA
                    </a>
                  </Link>
                </span>
                <p className="text-tertiary">Ask me anything.</p>
              </div>
              <div className="flex flex-col space-y-1">
                <span>
                  <Link passHref href="/hn">
                    <a className="font-medium text-primary highlight-link-hover">
                      Hacker News
                    </a>
                  </Link>
                </span>
                <p className="text-tertiary">A better Hacker News.</p>
              </div>
              <div className="flex flex-col space-y-1">
                <span>
                  <Link passHref href="/security">
                    <a className="font-medium text-primary highlight-link-hover">
                      Security Checklist
                    </a>
                  </Link>
                </span>
                <p className="text-tertiary">
                  Tools and resources for staying safe on the internet.
                </p>
              </div>
              <div className="flex flex-col space-y-1">
                <span>
                  <Link passHref href="/stack">
                    <a className="font-medium text-primary highlight-link-hover">
                      My Stack
                    </a>
                  </Link>
                </span>
                <p className="text-tertiary">
                  A curated list of my favorite tools and software.
                </p>
              </div>
            </div>

            <Divider />

            <div className="flex flex-col space-y-8">
              <div className="flex flex-col space-y-1">
                <h4 className="text-lg font-bold">Design Details Podcast</h4>
              </div>
              {data && data.episodes && (
                <PodcastEpisodesList episodes={data.episodes} />
              )}
              <span>
                <a
                  href="https://designdetails.fm"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-primary highlight-link-hover"
                >
                  Subscribe to Design Details &rarr;
                </a>
              </span>
            </div>

            <Divider />

            <div className="flex flex-col space-y-8">
              <div className="flex flex-col space-y-1">
                <h4 className="text-lg font-bold">Figma plugins</h4>
              </div>
              <FigmaPlugins />
              <span>
                <a
                  className="font-medium text-primary highlight-link-hover"
                  href="https://figma.com/@brian"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  See my Figma profile &rarr;
                </a>
              </span>
            </div>

            <Divider />

            <div className="flex flex-col space-y-8">
              <h4 className="text-lg font-bold">Open source work</h4>
              <div className="flex flex-col space-y-1">
                <span>
                  <a
                    className="font-medium text-primary highlight-link-hover"
                    href="https://github.com/designdetails/designdetails"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    designdetails / designdetails
                  </a>
                </span>
                <p className="text-tertiary">
                  The code that powers Design Details.
                </p>
              </div>

              <div className="flex flex-col space-y-1">
                <span>
                  <a
                    href="https://github.com/brianlovin/brian-lovin-next"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-primary highlight-link-hover"
                  >
                    brian-lovin-next
                  </a>
                </span>
                <p className="text-tertiary">
                  The code that powers this website you’re looking at.
                </p>
              </div>

              <div className="flex flex-col space-y-1">
                <span>
                  <a
                    href="https://github.com/withspectrum/spectrum"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-primary highlight-link-hover"
                  >
                    withspectrum / spectrum
                  </a>
                </span>
                <p className="text-tertiary">
                  Simple, powerful online communities.
                </p>
              </div>

              <div className="flex flex-col space-y-1">
                <span>
                  <a
                    href="https://github.com/specfm/spec-next"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-primary highlight-link-hover"
                  >
                    specfm / spec-next
                  </a>
                </span>
                <p className="text-tertiary">
                  A podcast network to help designers and developers level up.
                </p>
              </div>

              <span>
                <a
                  href="https://github.com/brianlovin"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-primary highlight-link-hover"
                >
                  Follow me on GitHub &rarr;
                </a>
              </span>
            </div>

            <Divider />

            <div className="flex flex-col space-y-8">
              <h4 className="text-lg font-bold">Speaking and interviews</h4>
              <div className="flex flex-col space-y-8">
                <div className="flex flex-col space-y-1">
                  <span>
                    <a
                      className="font-medium text-primary highlight-link-hover"
                      href="https://layout.fm/episodes/194/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Layout.fm: It Ran Into the Wall of Reality
                    </a>
                  </span>
                  <p className="text-tertiary">
                    I spoke with Kevin and Rafa about the Staff Design project,
                    career ladders, imposter syndrome, and Paul Rudd.
                  </p>
                </div>
                <div className="flex flex-col space-y-1">
                  <span>
                    <a
                      className="font-medium text-primary highlight-link-hover"
                      href="https://www.swiftbysundell.com/podcast/67/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Building for open source
                    </a>
                  </span>
                  <p className="text-tertiary">
                    Ryan Nystrom and I talk about designing and building the
                    mobile apps at GitHub.
                  </p>
                </div>

                <div className="flex flex-col space-y-1">
                  <span>
                    <a
                      className="font-medium text-primary highlight-link-hover"
                      href="https://www.youtube.com/watch?v=SyS3h3kmBnY"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Extend what’s possible with Figma Plugins - Figma Config
                    </a>
                  </span>
                  <p className="text-tertiary">
                    An exploration into the plugins I built to automate the
                    tedious parts of designing mobile apps at GitHub.
                  </p>
                </div>

                <div className="flex flex-col space-y-1">
                  <span>
                    <a
                      className="font-medium text-primary highlight-link-hover"
                      href="https://www.youtube.com/watch?v=6MBBTdu8v6E"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Designing with GraphQL - GraphQL Summit
                    </a>
                  </span>
                  <p className="text-tertiary">
                    Exploring the possibilities that open up when designers and
                    developers can speak the same language.
                  </p>
                </div>

                <div className="flex flex-col space-y-1">
                  <span>
                    <a
                      className="font-medium text-primary highlight-link-hover"
                      href="https://interfacelovers.com/interviews/brian-lovin"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Interface Lovers Interview
                    </a>
                  </span>
                  <p className="text-tertiary">
                    An interview about how I got into design, my process, and
                    past work.
                  </p>
                </div>

                <div className="flex flex-col space-y-1">
                  <span>
                    <a
                      className="font-medium text-primary highlight-link-hover"
                      href="https://spec.fm/podcasts/design-details/79352"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Charmander++ – Interviewing ourselves on Design Details
                    </a>
                  </span>
                  <p className="text-tertiary">
                    Bryn Jackson and I interviewed each other. Totally humble.
                  </p>
                </div>

                <div className="flex flex-col space-y-1">
                  <span>
                    <a
                      className="font-medium text-primary highlight-link-hover"
                      href="https://avocode.com/blog/brian-lovin-product-designer-github-interview"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Avocode Interview
                    </a>
                  </span>
                  <p className="text-tertiary">
                    An interview where we dig into my work at Buffer, Facebook,
                    Spectrum, and what’s in the works at GitHub.
                  </p>
                </div>

                <div className="flex flex-col space-y-1">
                  <span>
                    <a
                      className="font-medium text-primary highlight-link-hover"
                      href="https://softwareengineeringdaily.com/2020/07/15/github-mobile-with-brian-lovin-and-ryan-nystrom/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Software Engineering Daily: GitHub Mobile
                    </a>
                  </span>
                  <p className="text-tertiary">
                    Ryan and I discuss how we designed and built the first
                    version of GitHub’s mobile apps.
                  </p>
                </div>
              </div>
            </div>

            <Divider />

            <div className="flex flex-col space-y-6">
              <div className="flex flex-col space-y-8">
                <div className="flex flex-col space-y-1">
                  <h4 className="text-lg font-bold">App Dissection</h4>
                  <p className="text-tertiary">
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

export default Projects
