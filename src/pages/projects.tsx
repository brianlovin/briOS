import * as React from 'react'
import Link from 'next/link'
import Page, { PageHeader } from '~/components/Page'
import { CenteredColumn } from '~/components/Layouts'
import PodcastEpisodesList from '~/components/PodcastEpisodesList'
import FigmaPlugins from '~/components/FigmaPlugins'
import { initApolloClient } from '~/graphql/services/apollo'
import { GET_HOME } from '~/graphql/queries'
import { Post, Episode, Repo } from '~/graphql/types.generated'
import { NextSeo } from 'next-seo'
import routes from '~/config/routes'

interface Props {
  data: {
    posts: Post[]
    episodes?: Episode[]
    repos?: Repo[]
  }
}

function Projects({ data }: Props) {
  return (
    <Page>
      <NextSeo
        title={routes.about.seo.title}
        description={routes.about.seo.description}
        openGraph={routes.about.seo.openGraph}
      />

      <CenteredColumn>
        <div className="space-y-12" data-cy="projects-page">
          <PageHeader title="Projects" subtitle="" />
          <div className="space-y-20">
            <div className="space-y-6">
              <div className="space-y-1">
                <Link passHref href="/design-details">
                  <a className="font-medium highlight-link-hover">
                    App Dissection
                  </a>
                </Link>

                <p className="text-tertiary">
                  In-depth explorations of visual and interaction design in
                  well-known apps.
                </p>
              </div>
              <div className="space-y-1">
                <Link passHref href="/bookmarks">
                  <a className="font-medium highlight-link-hover">Bookmarks</a>
                </Link>

                <p className="text-tertiary">
                  Internet things, saved for later.
                </p>
              </div>
              <div className="space-y-1">
                <Link passHref href="/ama">
                  <a className="font-medium highlight-link-hover">AMA</a>
                </Link>

                <p className="text-tertiary">Ask me anything.</p>
              </div>
              <div className="space-y-1">
                <Link passHref href="/hn">
                  <a className="font-medium highlight-link-hover">
                    Better Hacker News
                  </a>
                </Link>

                <p className="text-tertiary">A better Hacker News.</p>
              </div>
              <div className="space-y-1">
                <Link passHref href="/security">
                  <a className="font-medium highlight-link-hover">
                    Security Checklist
                  </a>
                </Link>

                <p className="text-tertiary">
                  Tools and resources for staying safe on the internet.
                </p>
              </div>
              <div className="space-y-1">
                <Link passHref href="/stack">
                  <a className="font-medium highlight-link-hover">My Stack</a>
                </Link>

                <p className="text-tertiary">
                  A curated list of my favorite tools and software.
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-1">
                <h4 className="text-lg font-semibold">
                  Design Details Podcast
                </h4>
              </div>
              {data && data.episodes && (
                <PodcastEpisodesList episodes={data.episodes} />
              )}
              <a
                href="https://designdetails.fm"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block font-medium highlight-link-hover"
              >
                Subscribe to Design Details &rarr;
              </a>
            </div>

            <div className="space-y-6">
              <div className="space-y-1">
                <h4 className="text-lg font-semibold">Figma plugins</h4>
              </div>
              <FigmaPlugins />
              <a
                className="inline-block font-medium highlight-link-hover"
                href="https://figma.com/@brian"
                target="_blank"
                rel="noopener noreferrer"
              >
                See my Figma profile &rarr;
              </a>
            </div>

            <div className="space-y-6">
              <h4 className="text-lg font-semibold">Open source work</h4>
              <div className="space-y-1">
                <a
                  className="font-medium highlight-link-hover"
                  href="https://github.com/designdetails/designdetails"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  designdetails / designdetails
                </a>

                <p className="text-tertiary">
                  The code that powers Design Details.
                </p>
              </div>

              <div className="space-y-1">
                <a
                  href="https://github.com/brianlovin/brian-lovin-next"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium highlight-link-hover"
                >
                  brian-lovin-next
                </a>

                <p className="text-tertiary">
                  The code that powers this website you’re looking at.
                </p>
              </div>

              <div className="space-y-1">
                <a
                  href="https://github.com/withspectrum/spectrum"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium highlight-link-hover"
                >
                  withspectrum / spectrum
                </a>

                <p className="text-tertiary">
                  Simple, powerful online communities.
                </p>
              </div>

              <div className="space-y-1">
                <a
                  href="https://github.com/specfm/spec-next"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium highlight-link-hover"
                >
                  specfm / spec-next
                </a>

                <p className="text-tertiary">
                  A podcast network to help designers and developers level up.
                </p>
              </div>

              <a
                href="https://github.com/brianlovin"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block font-medium highlight-link-hover"
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
    },
  }
}

export default Projects
