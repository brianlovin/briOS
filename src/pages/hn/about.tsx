import * as React from 'react'
import Page from '~/components/Page'
import { NextSeo } from 'next-seo'
import { CenteredColumn } from '~/components/Layouts'
import { H3, P, H5 } from '~/components/Typography'
import Navigation from '~/components/HNPosts/Navigation'
import GlobalMarkdownStyles from '~/components/GlobalStyles/markdown'
import HNSubscribeBox from '~/components/HNSubscribe'
import Flex from '~/components/Flex'

export default function HNAbout() {
  return (
    <Page>
      <GlobalMarkdownStyles />

      <NextSeo
        title={'Hacker News · About'}
        description={'About my personal Hacker News reader.'}
        openGraph={{
          url: 'https://brianlovin.com/hn/about',
          title: 'Hacker News · About',
          description: 'About my personal Hacker News reader.',
          images: [
            {
              url: 'https://brianlovin.com/static/meta/hn.png',
              alt: 'Hacker News',
            },
          ],
        }}
      />

      <CenteredColumn data-cy="hn">
        <Flex flexDirection="column" gap={32}>
          <H3>Hacker News</H3>
          <Navigation active={'about'} />

          <Flex flexDirection="column" className={'markdown'}>
            <P>
              <a href="https://news.ycombinator.com">Hacker News</a> is a
              fantastic way to stay up to date on technology and software news.
              It’s especially helpful for discovering links to parts of the
              internet that I wouldn’t normally browse. The comments on these
              links expose me to new opinions that often change my mind.
            </P>

            <P>
              The best thing about HN is that it’s fast, no-nonsense, and
              information dense. It’s how most content websites should feel –
              snappy, no spinners, with an emphasis on function over form.
            </P>

            <P>
              Despite these points, HN has problems with core usability. I’ve
              attempted to solve these problems for myself by rebuilding a very
              small and lightweight Hacker News client here.
            </P>

            <P>
              While building this, it was important to retain near-instant page
              loads and high information density. This is done by statically
              pre-rendering all post lists and comment pages.
            </P>

            <H5>Typography</H5>
            <P>
              The type on Hacker News is too small. I find myself having to zoom
              to at least 130% in order to read things without squinting.
              Additionally, when reading comments there is no cap on line width.
              This makes it hard to read long comments and trace line breaks. I
              prefer my base font size with a capped line width.
            </P>

            <H5>Dark mode</H5>
            <P>
              HN doesn’t support a native dark mode. I have astigmatism and one
              of the symptoms is light sensitivity. My personal site always
              matches the system dark mode preference, which for me means I’ll
              always be able to read comments in dark mode.
            </P>

            <H5>Conversations</H5>
            <P>
              It’s really hard to follow conversations on HN. When a
              conversation goes many levels deep, it’s nearly impossible to tell
              where you are in the comment hiearchy based on whitespace alone.
            </P>
            <P>
              In my version, nested comments have vertical tracking lines. This
              makes it easier to trace comment relationships, and the lack of a
              tracking line quickly indicates that I’m reading a root comment.
              Additionally, HN only exposes the ability to collapse a comment
              thread by scrolling back up to the comment header. I’ve supported
              collapsing by clicking anywhere on the tracking line.
            </P>
            <P>
              Finally, I often find myself deep in a nested comment thread and
              just want to escape out to the next root level comment. I’ve added
              root-level comments to the tabIndex of the page, allowing me to
              quickly tab between threads.
            </P>

            <H5>Addicting</H5>
            <P>
              It’s tempting to check Hacker News multiple times per day. It’s
              distracting and results in a lot of context switching. Links often
              take me down a deep rabbit hole of new topics. I don’t like this
              trap.
            </P>
            <P>
              To combat this, I’ve done two things. First, my version updates
              infrequently. The Top list updates once every four hours. Second,
              I’ve hard-coded the volume of content. Only a handful of threads
              load at a time, and comments only render three levels deep.
            </P>

            <H5>Won’t fix</H5>
            <P>
              That’s it. These small problems got on my nerves just enough that
              it felt less painful to just build my own HN client than to keep
              dealing with eye strain and getting lost in conversations.
            </P>
            <P>
              I’ll keep an eye out for poorly rendered content and polish things
              incrementally. But I don’t plan to add support for other content
              types like polls or jobs, which I never visit on HN anyways.
            </P>
          </Flex>
        </Flex>
        <HNSubscribeBox />
      </CenteredColumn>
    </Page>
  )
}
