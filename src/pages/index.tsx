
import * as React from 'react';
import Link from 'next/link';
import useSWR from 'swr'
import Page, { SectionHeading } from '~/components/Page';
import { H2, A, Rarr, P, H5, Ul, Li } from '~/components/Typography'
import OverthoughtList from '~/components/Overthought/List'
import DesignDetailsGrid from '~/components/DesignDetailsGrid';
import PodcastEpisodesList from '~/components/PodcastEpisodesList';
import FigmaPlugins from '~/components/FigmaPlugins';
import { getFeaturedPosts } from '~/data/ghost'
import { BlogPost } from '~/types'
import cacheSsrRes from '~/lib/cacheSsr';
import defaultTheme from '~/components/Theme';

interface Props {
  posts?: Array<BlogPost>
}

function Home(props: Props) {
  const initialData = props.posts
  const { data: posts } = useSWR('/api/getFeaturedPosts', getFeaturedPosts, { initialData })
  
  const greetings = ["👋", "🤔", "🤓", "🤙", "🙋‍♂️", "🐵", "🎙", "🎨", "⌨️", "🖱", "📝", "👨‍💻", "📱"]
  const greeting = greetings[Math.floor(Math.random() * greetings.length)]

  return (
    <Page>
      <SectionHeading>
        <H2 style={{ marginBottom: defaultTheme.space[4] }}>{greeting}</H2>
        
        <P>I'm a product designer, podcaster, and writer, currently living in San Francisco. Right now I'm building native mobile apps at GitHub.</P>
        
        <P>
          <Link href="/about" as="/about">
            <A>More about me <Rarr /></A>
          </Link>
          <div>
            <A href="https://twitter.com/brian_lovin" target="_blank" rel="noopener noreferrer">@brian_lovin on Twitter <Rarr /></A>
          </div>
        </P>

        <H5 style={{ marginTop: defaultTheme.space[6], marginBottom: defaultTheme.space[2] }}>Writing</H5>

        <P>I like to think out loud about design, development, and building products.</P>

        <OverthoughtList truncated={true} posts={posts} />

        <P>
          <Link href="/overthought" as="/overthought">
            <A>See all {posts && posts.length} posts <Rarr /></A>
          </Link>
          
          <div>
            <A href="https://overthought.ghost.io/rss/" target="_blank" rel="noopener noreferrer">Subscribe via RSS <Rarr /></A>
          </div>
        </P>


        <H5 style={{ marginTop: defaultTheme.space[6], marginBottom: defaultTheme.space[2] }}>Design Details Podcast</H5>
        <P>Design Details is a weekly conversation about design process and culture. I've been a co-host on the show for over five years.</P>
        
        <PodcastEpisodesList />

        <P>
          <A href="https://designdetails.fm" target="_blank" rel="noopener noreferrer">See all episodes <Rarr /></A>
        </P>

        <H5 style={{ marginTop: defaultTheme.space[6], marginBottom: defaultTheme.space[2] }}>Figma plugins</H5>
        <P>
          There's a lot of work in the design process that is boring, tedious, and repetitive. I like to make plugins to help automate it away.
        </P>

        <FigmaPlugins />
        
        <P>
          <A href="https://figma.com/@brian" target="_blank" rel="noopener noreferrer">See my Figma profile <Rarr /></A>
        </P>

        <H5 style={{ marginTop: defaultTheme.space[6] }}>Open source work</H5>

        <Ul>
          <Li>
            <A href="https://github.com/specfm/design-details" target="_blank" rel="noopener noreferrer">
              specfm / design-details
            </A>
            <div>The code that powers designdetails.fm.</div>
          </Li>

          <Li>
            <A href="https://github.com/brianlovin/brian-lovin-next" target="_blank" rel="noopener noreferrer">
              brian-lovin-next
            </A>
            <div>The code that powers this website you’re looking at.</div>
          </Li>

          <Li>
            <A href="https://github.com/brianlovin/security-checklist" target="_blank" rel="noopener noreferrer">
              security-checklist
            </A>
            <div>A checklist for staying safe on the internet.</div>
          </Li>

          <Li>
            <A href="https://github.com/withspectrum/spectrum" target="_blank" rel="noopener noreferrer">
              withspectrum / spectrum
            </A>
            <div>Simple, powerful online communities.</div>
          </Li>

          <Li>
            <A href="https://github.com/specfm/spec-next" target="_blank" rel="noopener noreferrer">
              specfm / spec-next
            </A>
            <div>A podcast network to help designers and developers level up.</div>
          </Li>
        </Ul>

        <P>
          <A href="https://github.com/brianlovin" target="_blank" rel="noopener noreferrer">Follow me on GitHub <Rarr /></A>
        </P>

        <H5 style={{ marginTop: defaultTheme.space[6] }}>Speaking and interviews</H5>

        <Ul>
          <Li>
            <A href="https://www.swiftbysundell.com/podcast/67/" target="_blank" rel="noopener noreferrer">
              Building for open source
            </A>
            <div>Ryan Nystrom and I talk about designing and building the mobile apps at GitHub.</div>
          </Li>
          
          <Li>
            <A href="https://www.youtube.com/watch?v=SyS3h3kmBnY" target="_blank" rel="noopener noreferrer">
              Extend what's possible with Figma Plugins - Figma Config
            </A>
            <div>An exploration into the plugins I built to automate the tedious parts of designing mobile apps at GitHub.</div>
          </Li>

          <Li>
            <A href="https://www.youtube.com/watch?v=6MBBTdu8v6E" target="_blank" rel="noopener noreferrer">
              Designing with GraphQL - GraphQL Summit
            </A>
            <div>Exploring the possibilities that open up when designers and developers can speak the same language.</div>
          </Li>

          <Li>
            <A href="https://interfacelovers.com/interviews/brian-lovin" target="_blank" rel="noopener noreferrer">
              Interface Lovers Interview
            </A>
            <div>An interview about how I got into design, my process, and past work.</div>
          </Li>

          <Li>
            <A href="hhttps://spec.fm/podcasts/design-details/79352" target="_blank" rel="noopener noreferrer">
              Charmander++ – Interviewing ourselves on Design Details
            </A>
            <div>Bryn Jackson and I interviewed each other. Totally humble.</div>
          </Li>
        </Ul>

        <H5 style={{ marginTop: defaultTheme.space[6], marginBottom: defaultTheme.space[2] }}>App Dissection</H5>
        <P>In-depth explorations of visual and interaction design in well-known apps.</P>
        
        <P>
          <Link href="/design-details">
            <A>See all posts <Rarr /></A>
          </Link>
        </P>

        <DesignDetailsGrid truncate={true} />
      </SectionHeading>
    </Page>
  );
}

Home.getInitialProps = async ({ res }) => {
  cacheSsrRes({ res })
  const posts = await getFeaturedPosts();
  return { posts: posts }
}

export default Home
