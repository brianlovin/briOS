import * as React from 'react'
import Link from 'next/link'
import Page, { PageHeader } from '~/components/Page'
import { CenteredColumn } from '~/components/Layouts'
import Button from '~/components/Button'
import { initApolloClient } from '~/graphql/services/apollo'
import { GET_HOME } from '~/graphql/queries'
import { Post } from '~/graphql/types.generated'
import WritingSubscribeBox from '~/components/Writing/Subscribe'
import PostsList from '~/components/Writing/List'
import ProjectsList from '~/components/ProjectsList'

interface Props {
  data: {
    posts: Post[]
  }
}

function Home({ data }: Props) {
  return (
    <Page>
      <CenteredColumn>
        <div className="space-y-24 ">
          <div className="space-y-8 md:items-center">
            <PageHeader
              title="Hey, I’m Brian"
              subtitle="I’m a product designer living in San
                Francisco, currently building native mobile apps at GitHub."
            />

            <div className="grid grid-cols-2 gap-4">
              <Link href="/about" passHref>
                <a className="block">
                  <Button className="w-full">More about me</Button>
                </a>
              </Link>
              <a
                href="https://twitter.com/brian_lovin"
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <Button className="w-full">Follow me on Twitter</Button>
              </a>
            </div>
          </div>

          <div className="space-y-8">
            <h4 className="text-lg font-semibold text-primary">Writing</h4>
            <div className="space-y-6 ">
              {data && data.posts && <PostsList posts={data.posts} />}
            </div>
            <Link href="/projects">
              <a className="inline-block font-medium highlight-link-hover">
                Read all posts &rarr;
              </a>
            </Link>
          </div>

          <div className="space-y-8">
            <h4 className="text-lg font-semibold text-primary">Projects</h4>
            <ProjectsList />
            <Link href="/projects">
              <a className="inline-block font-medium highlight-link-hover">
                See all my projects &rarr;
              </a>
            </Link>
          </div>

          <WritingSubscribeBox />
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

export default Home
