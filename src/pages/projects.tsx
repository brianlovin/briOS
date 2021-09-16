import * as React from 'react'
import Page, { PageHeader } from '~/components/Page'
import { CenteredColumn } from '~/components/Layouts'
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
          <ProjectsList episodes={data.episodes} />
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
