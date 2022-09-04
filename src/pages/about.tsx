import * as React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Page from '~/components/Page'
import { CenteredColumn } from '~/components/Layouts'
import OverthoughtList from '~/components/Ghost/List'
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
          {/* <div className="-mx-4 -mt-24 md:mt-0 md:-mx-8 "> */}
          <div className="-mx-0 -mt-0 md:mt-0 md:-mx-0 ">
            <Image
              // src="https://d2fl8krjhnb3wd.cloudfront.net/static/img/about.png"
              src="/static/img/me.jpg"
              alt={'A photo of me'}
              layout="responsive"
              width="1000"
              height="1000"
              className="md:rounded-lg"
            />
          </div>
          <div className="flex flex-col space-y-12">
            <div className="flex flex-col prose lg:prose-lg">
              <p>
                Paul is a multi cloud certified{' '}
                <a
                  href="https://www.credential.net/7cec8ff7-d2b0-4a31-baa4-ed4ff116e7c2"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Professional Cloud Architect
                </a>{' '}
                at{' '}
                <a
                  href="https://www.bmo.com/main/about-bmo/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  BMO Financial Group
                </a>
                . He helps the organization with it&apos;s data challenges, from
                ensuring the architecture meets the business needs to attaining
                robust insights, and uncovering missed opportunities. With his
                expertise in Data Engineering, and a myriad of capabilities, he
                enables the Digital Acquisition business effectively leverage
                Data and AI-driven strategies.
              </p>
              <p>
                Before BMO, he worked as a Business System Analyst at{' '}
                <a
                  href="https://www.td.com/about-tdbfg/corporate-information/corporate-profile/profile.jsp"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  TD Bank Financial Group
                </a>{' '}
                where he supported the Transaction Monitoring business to reduce
                the risk of money laundering and fraud offences. He developed
                robust analytics and reporting solutions that encompass all
                banking verticals (including payments, mututal funds, lending,
                and insurance) to ensure business rules for revealing fraud and
                money laundering evolve in step with offenders' practices.
              </p>

              <p>
                You can find him on{' '}
                <a
                  href="https://github.com/paulowe"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub
                </a>{' '}
                where he is building in the open, or on{' '}
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
            <div className="-mx-0 -mt-0 md:mt-0 md:-mx-0 ">
              <Image
                src="/static/img/yyz.png"
                width={800}
                height={400}
                layout="responsive"
                className="rounded-2xl"
                quality={100}
                alt="Map of Toronto with blue location dot in the middle"
              />
            </div>
            <Divider />

            <div className="flex flex-col space-y-4">
              <div className="flex flex-col space-y-1">
                <h4>Writing</h4>

                <p className="text-lg">Thoughts, stories and ideas.</p>
              </div>

              {data && data.posts && <OverthoughtList posts={data.posts} />}

              <div className="flex flex-col space-y-1">
                <Link href="/paulsmessage" as="/paulsmessage" passHref>
                  <a className="text-blue-600 dark:text-blue-500">
                    See all posts &rarr;
                  </a>
                </Link>

                <a
                  href="https://paulsmessage.com/rss/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-500"
                >
                  Subscribe via RSS &rarr;
                </a>
              </div>
            </div>

            <div className="flex flex-col space-y-4">
              <h4>Data Science Portfolio</h4>
              <p className="text-lg">
                Exploring the art of AI/ML, one concept at a time.
              </p>
              <div className="flex flex-col space-y-1">
                <a
                  href="https://github.com/paulowe/hyperparameter-optimization"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-500"
                >
                  paulowe / hyperparameter-optimization
                </a>
                <p>
                  Advanced hyperparameter optimization techniques including
                  Bayesian, Multi-fidelity, and SMBO algorithms.
                </p>
              </div>

              <div className="flex flex-col space-y-1">
                <a
                  className="text-blue-600 dark:text-blue-500"
                  href="https://github.com/paulowe/influence-max-gpp"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  paulowe / influence-max-gpp
                </a>
                <p>
                  A graph processing platform to create a ranking dashboard of
                  influential Twitter profiles using Neo4J and Spark.{' '}
                </p>
              </div>

              <div className="flex flex-col space-y-1">
                <a
                  href="https://github.com/paulowe/tensorflow-lifetime-value"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-500"
                >
                  paulowe / tensorflow-lifetime-value
                </a>
                <p>
                  A neural network model for predicting CLTV scores using
                  Tensorflow and Lifetimes Python Library.
                </p>
              </div>

              <div className="flex flex-col space-y-1">
                <a
                  href="https://github.com/paulowe/twint"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-500"
                >
                  paulowe / twint
                </a>
                <p>
                  An advanced Twitter scraping &amp; OSINT tool written in
                  Python.
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
