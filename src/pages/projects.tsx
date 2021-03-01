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
import ProjectsList from '~/components/ProjectsList'

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
        title={routes.projects.seo.title}
        description={routes.projects.seo.description}
        openGraph={routes.projects.seo.openGraph}
      />

      <CenteredColumn>
        <div className="space-y-12" data-cy="projects-page">
          <PageHeader title="Projects" subtitle="" />
          <div className="space-y-20">
            <ProjectsList />

            <div className="space-y-6">
              <div className="space-y-6">
                <h4 className="text-lg font-semibold text-primary">
                  Design Details Podcast
                </h4>
                <p className="text-secondary">
                  I have co-hosted the Design Details Podcast since 2014. The
                  first 256 episodes were interviews with designers, engineers,
                  and founders about how they got to where they are today.
                </p>
                <p className="text-secondary">
                  After episode 256, we switched to a more topical news-style
                  show where we answer listener questions, share design tips and
                  tricks, and occassionally bring on guests to chat.
                </p>
                <p className="text-secondary">
                  Here are some of our most recent episodes, to give you a
                  flavor of the show:
                </p>
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
                Check out all the episodes &rarr;
              </a>
            </div>

            <div className="space-y-6">
              <div className="space-y-1">
                <h4 className="text-lg font-semibold text-primary">
                  Figma plugins
                </h4>
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
              <h4 className="text-lg font-semibold text-primary">
                Open source work
              </h4>
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
