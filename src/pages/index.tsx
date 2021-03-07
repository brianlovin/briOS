import * as React from 'react'
import Link from 'next/link'
import Page from '~/components/Page'
import { CenteredColumn } from '~/components/Layouts'
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
            <div className="prose text-primary">
              <p>
                Hey, I&apos;m Brian. I&apos;m a designer,{' '}
                <a href="https://designdetails.fm">podcaster</a>,{' '}
                <Link href="/writing" passHref>
                  <a>writer</a>
                </Link>
                , and{' '}
                <a href="https://github.com/brianlovin">software tinkerer</a>.
                I&apos;m currently building{' '}
                <a href="https://github.com/mobile">
                  native mobile apps at GitHub
                </a>
                .
              </p>

              <p>
                In the past I co-founded{' '}
                <a href="https://github.com/withspectrum/spectrum">Spectrum</a>,
                a platform for online communities. Before that, I worked at
                Facebook building payments systems, and cut my teeth as a
                product designer at Buffer.
              </p>

              <p>
                You can{' '}
                <Link href="/about" passHref>
                  <a>learn more about me</a>
                </Link>
                , or{' '}
                <a href="https://twitter.com/brian_lovin">
                  follow me on Twitter
                </a>{' '}
                for tweets about design, development, and technology.
              </p>
            </div>
          </div>

          <div className="space-y-8">
            <h4 className="font-list-heading">Recent Writing</h4>
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
            <h4 className="font-list-heading">Select Projects</h4>
            <ProjectsList />
            <Link href="/projects">
              <a className="inline-block font-medium highlight-link-hover">
                See all projects &rarr;
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
