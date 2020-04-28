import * as React from 'react'
import Link from 'next/link'
import Page, { SectionHeading } from '~/components/Page'
import { H2, A, Rarr, P, H5, Ul, Li } from '~/components/Typography'
import OverthoughtList from '~/components/Overthought/List'
import DesignDetailsGrid from '~/components/DesignDetailsGrid'
import PodcastEpisodesList from '~/components/PodcastEpisodesList'
import FigmaPlugins from '~/components/FigmaPlugins'
import { HOME } from '~/api/queries'
import { fetcher } from '~/api'
import { Post, Episode } from '~/types/graphql'
import defaultTheme from '~/components/Theme'

interface Props {
  data: {
    posts: Post[]
    episodes?: Episode[]
  }
}

function Home({ data }: Props) {
  return (
    <Page>
      <SectionHeading>
        <H2 style={{ marginBottom: defaultTheme.space[4] }}>👋</H2>

        <H5 style={{ marginBottom: defaultTheme.space[4] }}>Hey, I’m Brian.</H5>
        <P>
          I’m a product designer, podcaster, and writer, currently living in San
          Francisco. Right now I’m building native mobile apps at GitHub. Let’s
          grab a coffee.
        </P>

        <P>
          <Link href="/about" as="/about" passHref>
            <A>
              More about me <Rarr />
            </A>
          </Link>
          <span style={{ display: 'block' }}>
            <A
              href="https://twitter.com/brian_lovin"
              target="_blank"
              rel="noopener noreferrer"
            >
              @brian_lovin on Twitter <Rarr />
            </A>
          </span>
        </P>

        <H5
          style={{
            marginTop: defaultTheme.space[6],
            marginBottom: defaultTheme.space[2],
          }}
        >
          Writing
        </H5>

        <P>
          I like to think out loud about design, development, and building
          products.
        </P>

        {data && data.posts && <OverthoughtList posts={data.posts} />}

        <P>
          <Link href="/overthought" as="/overthought" passHref>
            <A>
              See all posts <Rarr />
            </A>
          </Link>

          <span style={{ display: 'block' }}>
            <A
              href="https://overthought.ghost.io/rss/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Subscribe via RSS <Rarr />
            </A>
          </span>
        </P>

        <H5
          style={{
            marginTop: defaultTheme.space[6],
            marginBottom: defaultTheme.space[2],
          }}
        >
          Design Details Podcast
        </H5>
        <P>
          Design Details is a weekly conversation about design process and
          culture. I’ve been a co-host on the show for over five years.
        </P>

        {data && data.episodes && (
          <PodcastEpisodesList episodes={data.episodes} />
        )}

        <P>
          <A
            href="https://designdetails.fm/episodes"
            target="_blank"
            rel="noopener noreferrer"
          >
            See all episodes <Rarr />
          </A>
        </P>

        <H5
          style={{
            marginTop: defaultTheme.space[6],
            marginBottom: defaultTheme.space[2],
          }}
        >
          Figma plugins
        </H5>
        <P>
          There’s a lot of work in the design process that is boring, tedious,
          and repetitive. I like to make plugins to help automate it away.
        </P>

        <FigmaPlugins />

        <P>
          <A
            href="https://figma.com/@brian"
            target="_blank"
            rel="noopener noreferrer"
          >
            See my Figma profile <Rarr />
          </A>
        </P>

        <H5 style={{ marginTop: defaultTheme.space[6] }}>Open source work</H5>

        <Ul style={{ listStyleType: 'none', marginLeft: 0 }}>
          <Li>
            <A
              href="https://github.com/specfm/design-details"
              target="_blank"
              rel="noopener noreferrer"
            >
              specfm / design-details
            </A>
            <span style={{ display: 'block' }}>
              The code that powers designdetails.fm.
            </span>
          </Li>

          <Li>
            <A
              href="https://github.com/brianlovin/brian-lovin-next"
              target="_blank"
              rel="noopener noreferrer"
            >
              brian-lovin-next
            </A>
            <span style={{ display: 'block' }}>
              The code that powers this website you’re looking at.
            </span>
          </Li>

          <Li>
            <A
              href="https://github.com/brianlovin/security-checklist"
              target="_blank"
              rel="noopener noreferrer"
            >
              security-checklist
            </A>
            <span style={{ display: 'block' }}>
              A checklist for staying safe on the internet.
            </span>
          </Li>

          <Li>
            <A
              href="https://github.com/withspectrum/spectrum"
              target="_blank"
              rel="noopener noreferrer"
            >
              withspectrum / spectrum
            </A>
            <span style={{ display: 'block' }}>
              Simple, powerful online communities.
            </span>
          </Li>

          <Li>
            <A
              href="https://github.com/specfm/spec-next"
              target="_blank"
              rel="noopener noreferrer"
            >
              specfm / spec-next
            </A>
            <span style={{ display: 'block' }}>
              A podcast network to help designers and developers level up.
            </span>
          </Li>
        </Ul>

        <P>
          <A
            href="https://github.com/brianlovin"
            target="_blank"
            rel="noopener noreferrer"
          >
            Follow me on GitHub <Rarr />
          </A>
        </P>

        <H5 style={{ marginTop: defaultTheme.space[6] }}>
          Speaking and interviews
        </H5>

        <Ul style={{ listStyleType: 'none', marginLeft: 0 }}>
          <Li>
            <A
              href="https://www.swiftbysundell.com/podcast/67/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Building for open source
            </A>
            <span style={{ display: 'block' }}>
              Ryan Nystrom and I talk about designing and building the mobile
              apps at GitHub.
            </span>
          </Li>

          <Li>
            <A
              href="https://www.youtube.com/watch?v=SyS3h3kmBnY"
              target="_blank"
              rel="noopener noreferrer"
            >
              Extend what’s possible with Figma Plugins - Figma Config
            </A>
            <span style={{ display: 'block' }}>
              An exploration into the plugins I built to automate the tedious
              parts of designing mobile apps at GitHub.
            </span>
          </Li>

          <Li>
            <A
              href="https://www.youtube.com/watch?v=6MBBTdu8v6E"
              target="_blank"
              rel="noopener noreferrer"
            >
              Designing with GraphQL - GraphQL Summit
            </A>
            <span style={{ display: 'block' }}>
              Exploring the possibilities that open up when designers and
              developers can speak the same language.
            </span>
          </Li>

          <Li>
            <A
              href="https://interfacelovers.com/interviews/brian-lovin"
              target="_blank"
              rel="noopener noreferrer"
            >
              Interface Lovers Interview
            </A>
            <span style={{ display: 'block' }}>
              An interview about how I got into design, my process, and past
              work.
            </span>
          </Li>

          <Li>
            <A
              href="https://spec.fm/podcasts/design-details/79352"
              target="_blank"
              rel="noopener noreferrer"
            >
              Charmander++ – Interviewing ourselves on Design Details
            </A>
            <span style={{ display: 'block' }}>
              Bryn Jackson and I interviewed each other. Totally humble.
            </span>
          </Li>
        </Ul>

        <H5
          style={{
            marginTop: defaultTheme.space[6],
            marginBottom: defaultTheme.space[2],
          }}
        >
          App Dissection
        </H5>
        <P>
          In-depth explorations of visual and interaction design in well-known
          apps.
        </P>

        <P>
          <Link href="/design-details" passHref>
            <A>
              See all posts <Rarr />
            </A>
          </Link>
        </P>

        <DesignDetailsGrid truncate={true} />
      </SectionHeading>
    </Page>
  )
}

export async function getStaticProps() {
  const data = await fetcher({ query: HOME })
  return { props: { data }, unstable_revalidate: true }
}

export default Home
