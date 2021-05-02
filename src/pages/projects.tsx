import * as React from 'react'
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

const workHistory = [
  {
    name: 'GitHub · Staff Product Designer',
    timeframe: 'November 2018 – Present',
  },
  {
    name: 'Spectrum · Co-founder',
    timeframe: 'February 2017 – November 2018',
  },
  {
    name: 'Spec.fm · Co-founder',
    timeframe: 'July, 2015 – July, 2020',
  },
  {
    name: 'Facebook · Product Designer',
    timeframe: 'July 2015 – July 2017',
  },
  {
    name: 'Buffer · Product Designer',
    timeframe: 'June 2013 – July 2015',
  },
  {
    name: 'The Kollection · Founder',
    timeframe: 'June 2010 – June 2015',
    description: '',
  },
]

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

          <div className="space-y-16 md:space-y-24">
            <div className="space-y-8">
              <h4 className="font-list-heading">Select Projects</h4>
              <ProjectsList />
            </div>

            <div className="space-y-6">
              <div className="space-y-6">
                <h4 className="font-list-heading">Design Details Podcast</h4>
                <p className="text-secondary lg:prose-lg">
                  A weekly conversation about design process and culture,
                  co-hosted with{' '}
                  <a
                    href="https://twitter.com/marshallbock"
                    className="highlight-link"
                  >
                    @marshallbock
                  </a>
                  .
                </p>
              </div>
              {data && data.episodes && (
                <PodcastEpisodesList episodes={data.episodes} />
              )}
              <a
                href="https://designdetails.fm"
                className="inline-block font-medium highlight-link-hover"
              >
                Check out all the episodes &rarr;
              </a>
            </div>

            <div className="space-y-6">
              <div className="space-y-1">
                <h4 className="font-list-heading">Figma plugins</h4>
              </div>
              <FigmaPlugins />
              <a
                className="inline-block font-medium highlight-link-hover"
                href="https://figma.com/@brian"
              >
                See my Figma profile &rarr;
              </a>
            </div>

            <div className="space-y-6">
              <h4 className="font-list-heading">Open source work</h4>
              <div className="space-y-1">
                <a
                  href="https://github.com/brianlovin/brian-lovin-next"
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
                  className="font-medium highlight-link-hover"
                  href="https://github.com/designdetails/designdetails"
                >
                  designdetails / designdetails
                </a>

                <p className="text-tertiary">
                  The code that powers Design Details.
                </p>
              </div>

              <div className="space-y-1">
                <a
                  href="https://github.com/specfm/spec-next"
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
                className="inline-block font-medium highlight-link-hover"
              >
                See my work on GitHub &rarr;
              </a>
            </div>
            <div className="space-y-6">
              <h4 className="font-list-heading">Work history</h4>
              {workHistory.map((job) => (
                <div className="space-y-1" key={job.name}>
                  <p className="font-medium text-secondary">{job.name}</p>
                  <p className="text-quaternary">{job.timeframe}</p>
                </div>
              ))}
              <a
                href="https://www.linkedin.com/in/brianlovin/"
                className="inline-block font-medium highlight-link-hover"
              >
                See my LinkedIn &rarr;
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
