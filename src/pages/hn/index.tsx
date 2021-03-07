import * as React from 'react'
import Page, { PageHeader } from '~/components/Page'
import { NextSeo } from 'next-seo'
import { CenteredColumn } from '~/components/Layouts'
import HNPosts from '~/components/HNPosts'
import { HNComment } from '~/components/HNPost/Comment'
import { getHNPosts } from '~/graphql/services/hn'
import HNSubscribeBox from '~/components/HNSubscribe'
import routes from '~/config/routes'
import Divider from '~/components/Divider'
import Link from 'next/link'

export interface HNPost {
  id: string
  title: string
  user: string
  time: number
  time_ago: string
  comments: HNComment[]
  comments_count: string
  url: string
  domain: string
  content: string
}

interface Props {
  posts: HNPost[]
}

export default function HNTop(props: Props) {
  const { posts } = props

  return (
    <Page>
      <NextSeo
        title={routes.hn.seo.title}
        description={routes.hn.seo.description}
        openGraph={routes.hn.seo.openGraph}
      />

      <CenteredColumn data-cy="hn">
        <div className="space-y-8">
          <Link href="/projects" passHref>
            <a className="leading-snug text-tertiary hover:text-gray-1000 dark:hover:text-gray-100">
              &larr; Projects
            </a>
          </Link>

          <PageHeader title="Hacker News" />

          <HNSubscribeBox />

          <HNPosts posts={posts} />

          <div className="py-4" />
          <Divider />
          <div className="py-4" />

          <div className="prose">
            <h5>About this page</h5>
            <p>
              <a href="https://news.ycombinator.com">Hacker News</a> is a
              fantastic way to stay up to date on technology and software news.
              It’s especially helpful for discovering links to parts of the
              internet that I wouldn’t normally browse. The comments on these
              links expose me to new opinions that often change my mind.
            </p>

            <p>
              The best thing about HN is that it’s fast, no-nonsense, and
              information dense. It’s how most content websites should feel –
              snappy, no spinners, with an emphasis on function over form.
            </p>

            <p>
              Despite these points, HN has problems with core usability. I’ve
              attempted to solve these problems for myself by rebuilding a very
              small and lightweight Hacker News client here.
            </p>

            <p>
              While building this, it was important to retain near-instant page
              loads and high information density. This is done by statically
              pre-rendering all post lists and comment pages.
            </p>

            <strong>Typography</strong>
            <p>
              The type on Hacker News is too small. I find myself having to zoom
              to at least 130% in order to read things without squinting.
              Additionally, when reading comments there is no cap on line width.
              This makes it hard to read long comments and trace line breaks. I
              prefer my base font size with a capped line width.
            </p>

            <strong>Dark mode</strong>
            <p>
              HN doesn’t support a native dark mode. I have astigmatism and one
              of the symptoms is light sensitivity. My personal site always
              matches the system dark mode preference, which for me means I’ll
              always be able to read comments in dark mode.
            </p>

            <strong>Conversations</strong>
            <p>
              It’s really hard to follow conversations on HN. When a
              conversation goes many levels deep, it’s nearly impossible to tell
              where you are in the comment hiearchy based on whitespace alone.
            </p>
            <p>
              In my version, nested comments have vertical tracking lines. This
              makes it easier to trace comment relationships, and the lack of a
              tracking line quickly indicates that I’m reading a root comment.
              Additionally, HN only exposes the ability to collapse a comment
              thread by scrolling back up to the comment header. I’ve supported
              collapsing by clicking anywhere on the tracking line.
            </p>
            <p>
              Finally, I often find myself deep in a nested comment thread and
              just want to escape out to the next root level comment. I’ve added
              root-level comments to the tabIndex of the page, allowing me to
              quickly tab between threads.
            </p>

            <strong>Addicting</strong>
            <p>
              It’s tempting to check Hacker News multiple times per day. It’s
              distracting and results in a lot of context switching. Links often
              take me down a deep rabbit hole of new topics. I don’t like this
              trap.
            </p>
            <p>
              To combat this, I’ve done two things. First, my version updates
              infrequently. The Top list updates once every four hours. Second,
              I’ve hard-coded the volume of content. Only a handful of threads
              load at a time, and comments only render three levels deep.
            </p>

            <strong>Won’t fix</strong>
            <p>
              That’s it. These small problems got on my nerves just enough that
              it felt less painful to just build my own HN client than to keep
              dealing with eye strain and getting lost in conversations.
            </p>
            <p>
              I’ll keep an eye out for poorly rendered content and polish things
              incrementally. But I don’t plan to add support for other content
              types like polls or jobs, which I never visit on HN anyways.
            </p>
          </div>
        </div>
      </CenteredColumn>
    </Page>
  )
}

export async function getStaticProps() {
  const posts = await getHNPosts('top')

  return {
    revalidate: 60 * 60 * 4,
    props: {
      posts,
    },
  }
}
