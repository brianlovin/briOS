import * as React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Page from '~/components/Page'
import { CenteredColumn } from '~/components/Layouts'
import { TimelineContainer, TimelineItem } from '~/components/Timeline'
import { Button } from '~/components/Button'
import { GitMerge } from 'react-feather'
import FetchUrl from '~/components/FetchUrl'
import { withApollo } from '~/components/withApollo'
import { initApolloClient } from '~/graphql/services/apollo'

function Home() {
  return (
    <Page>
      <CenteredColumn>
        <div className="flex flex-col space-y-14">
          <div className="flex flex-col space-y-8 md:items-center">
            <p className="text-4xl">👾</p>
            <div className="flex flex-col space-y-4 md:items-center md:text-center">
              <h1>Hey, I’m Brian.</h1>
              <p className="text-2xl">
                I’m a product designer, podcaster, and writer, living in San
                Francisco. I’m currently building native mobile apps at GitHub.
              </p>
            </div>

            <div className="flex space-x-4 md:items-center md:justify-center">
              <Link href="/about" as="/about" passHref>
                <a className="btn">More about me</a>
              </Link>
              <a
                className="btn btn-black"
                href="https://twitter.com/brian_lovin"
                target="_blank"
                rel="noopener noreferrer"
              >
                Follow me on Twitter
              </a>
            </div>

            <TimelineContainer>
              <TimelineItem
                title="Moved Security Checklist to personal site"
                timestamp="November 24, 2020"
                icon="commit"
              >
                <div className="ml-16 prose md:ml-0 prose-md">
                  <p>
                    Over the years domains and side projects accumulate. It
                    takes mental overhead to keep things updated, running, and
                    paid for. I’m going to start slowly integrating personal
                    projects like Security Checklist into this codebase as a
                    more future-proof way to tinker.
                  </p>
                  <div className="flex space-x-3">
                    <Link passHref href="/security">
                      <a>
                        <Button>
                          <span>View Security Checklist</span>
                        </Button>
                      </a>
                    </Link>
                    <a
                      href="https://github.com/brianlovin/brian-lovin-next/pull/1188"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button>
                        <>
                          <GitMerge size={16} />
                          <span>View pull request</span>
                        </>
                      </Button>
                    </a>
                  </div>
                </div>
              </TimelineItem>
              <TimelineItem
                title="Rebuilt site with Tailwind.css"
                timestamp="November 22, 2020"
                icon="wind"
              >
                <div className="ml-16 prose md:ml-0 prose-md">
                  <p>
                    So far, so good! The migration was painless (except for a
                    few cases where outdated tutorials led me down the wrong
                    path for CSS purging solutions). But here we are: as I
                    slowly start to memorize the syntax, I feel like I have
                    super powers.
                  </p>
                  <div className="flex space-x-3">
                    <a
                      href="https://tailwindcss.com"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button>Tailwind.css</Button>
                    </a>
                    <a
                      href="https://github.com/brianlovin/brian-lovin-next/pull/1175"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button>
                        <>
                          <GitMerge size={16} />
                          <span>View pull request</span>
                        </>
                      </Button>
                    </a>
                  </div>
                </div>
              </TimelineItem>

              <TimelineItem
                title="Published new post"
                tint="blue"
                icon="edit"
                timestamp="November 16, 2020"
              >
                <>
                  <Link href="https://brianlovin.com/overthought/design-to-save-people-from-themselves">
                    <a className="transition-shadow rounded-lg shadow hover:shadow-cardHover">
                      <Image
                        src="/static/img/overthought/design-to-save-people-from-themselves.png"
                        width="1012"
                        height="506"
                        layout="responsive"
                        className="rounded-lg"
                      />
                    </a>
                  </Link>
                  <div className="ml-16 prose md:ml-0 prose-md">
                    <div className="flex space-x-3">
                      <Link passHref href="/security">
                        <a>
                          <Button>
                            <span>View Security Checklist</span>
                          </Button>
                        </a>
                      </Link>
                      <a
                        href="https://github.com/brianlovin/brian-lovin-next/pull/1188"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button>
                          <>
                            <GitMerge size={16} />
                            <span>View pull request</span>
                          </>
                        </Button>
                      </a>
                    </div>
                  </div>
                </>
              </TimelineItem>

              <TimelineItem
                title="Created Waves wallpapers"
                timestamp="November 15, 2020"
                icon="zap"
                tint="purple"
              >
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://gumroad.com/l/waves-premium-phone-wallpapers"
                >
                  <div className="flex flex-col overflow-hidden transition-shadow bg-white rounded-lg shadow md:flex-row dark:bg-gray-900 hover:shadow-cardHover">
                    <div className="flex flex-col justify-start px-6 py-6 space-y-2 md:w-1/2">
                      <h5>Waves</h5>
                      <p className="flex-1 font-normal">
                        A custom-made set of 10 phone wallpapers, each with a
                        unique color palette and design. I think they’re
                        beautiful – I hope you like them, too!
                      </p>
                      <span />
                      <div className="w-full p-2 text-center text-white bg-blue-500 rounded hover:bg-blue-600 dark:hover:bg-blue-400">
                        View the collection
                      </div>
                    </div>
                    <div className="hidden w-full md:w-1/2 md:inline-block">
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
              </TimelineItem>

              <TimelineItem
                title="Upgraded to iPhone 12 Pro Max"
                timestamp="November 14, 2020"
                icon="meh"
              >
                <div className="ml-16 prose md:ml-0 prose-md">
                  <p>After 24 hours, first impressions:</p>
                  <ul>
                    <li>It just feels…cheaper. The 11 Pro felt premium.</li>
                    <li>
                      I love big phones, but this one is noticeably harder to
                      hold because of the squared edges.
                    </li>
                    <li>The camera bump is surprisingly chonky.</li>
                  </ul>
                </div>
              </TimelineItem>

              <FetchUrl url="https://github.com/brianlovin/brian-lovin-next/pull/1188" />
            </TimelineContainer>
          </div>
        </div>
      </CenteredColumn>
    </Page>
  )
}

export async function getStaticProps() {
  const client = await initApolloClient({})
  /*
    Because this is using withApollo, the data from this query will be
    pre-populated in the Apollo cache at build time. When the user first
    visits this page, we can retreive the data from the cache like this:

    const { data } = useGetBookmarksQuery({ fetchPolicy: 'cache-and-network' })

    This preserves the ability for the page to render all bookmarks instantly,
    then get progressively updated if any new bookmarks come in over the wire.
  */
  const apolloStaticCache = client.cache.extract()
  return {
    revalidate: 1,
    props: {
      apolloStaticCache,
    },
  }
}

export default withApollo(Home)
