// @flow
import * as React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Page, {
  SectionHeading,
  Heading,
  Paragraph,
} from '../../components/Page';

export default function About() {
  return (
    <Page>
      <Head>
        <title>Brian Lovin · About</title>
        <meta content="Brian Lovin · About" name="og:title" key="og:title" />
        <meta content="Designer" name="og:description" key="og:description" />
        <meta
          content="Brian Lovin · About"
          name="twitter:title"
          key="twitter:title"
        />
      </Head>

      <SectionHeading>
        <Heading>About me</Heading>

        <div style={{ padding: '8px' }} />

        <Paragraph>
          I’m a designer and developer currently building community experiences
          at{' '}
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
          . After five years of working in San Francisco, I now live and work in
          Manhattan.
        </Paragraph>

        <Paragraph>
          Prior to GitHub I co-founded{' '}
          <a
            href="https://spectrum.chat"
            target="_blank"
            rel="noopener noreferrer"
          >
            Spectrum.chat
          </a>{' '}
          with{' '}
          <a
            href="https://twitter.com/mxstbr"
            target="_blank"
            rel="noopener noreferrer"
          >
            Max Stoiber
          </a>{' '}
          and{' '}
          <a
            href="https://twitter.com/superbryntendo"
            target="_blank"
            rel="noopener noreferrer"
          >
            Bryn Jackson
          </a>{' '}
          to build better tools for large, asynchronous online communities.
          Spectrum was acquired by GitHub in November, 2018.
        </Paragraph>

        <Paragraph>
          Before starting Spectrum, I worked at Facebook as a lead product
          designer building payments experiences on Messenger, Facebook,
          WhatsApp, and Instagram. I joined Facebook after two years of working
          at{' '}
          <a
            href="https://buffer.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Buffer
          </a>
          , a social media management startup where I was the first product
          designer.
        </Paragraph>

        <Paragraph>
          Along the way I've started several side projects. In 2008 I created my
          first design blog, Elite by Design (offline). This site was my
          learning playground where I documented tutorials, tips and tricks,
          interviews, and resource lists for graphic and web designers. Elite by
          Design was my entry point into the world of design, and more
          specifically, product design.
        </Paragraph>

        <Paragraph>
          Before leaving for college in 2010 I started a music discovery website
          called The Kollection. At its peak, The Kollection was reaching more
          than a million people per month and streaming tens of millions of
          songs from independent artists looking for their big break. One of my
          favorite memories from The Kollection was getting to interview
          Macklemore and Ryan Lewis at a show in Austin, Texas, the year before
          they won their first Grammy. I managed The Kollection for 5 years,
          helping share thousands of songs with the help of more than 50
          contributing writers.
        </Paragraph>

        <Paragraph>
          In 2014 I became fascinated with the tiny design details that made the
          best applications and products betterr. I began documenting these
          interactions, animations, and beautiful touches in a blog series
          called{' '}
          <Link href="/design-details" as="/design-details">
            Design Details
          </Link>
          . Between 2014 and 2016 I documented 22 applications with screen
          recordings and my own personal notes. These posts have reached
          hundreds of thousands of designers on the web, and the videos have
          been streamed millions of times.
        </Paragraph>

        <Paragraph>
          In late 2014, Bryn Jackson and I met during a meetup at the GitHub
          headquarters in San Francisco. He came up with the idea of
          interviewing the designers who were designing the products that I'd
          been documenting on the Design Details Blog. We teamed up to start the{' '}
          <a
            href="https://spec.fm/podcasts/design-details"
            target="_blank"
            rel="noopener noreferrer"
          >
            Design Details Podcast
          </a>
          .
        </Paragraph>

        <Paragraph>
          Bryn and I co-hosted the podcast together for 256 episodes,
          interviewing hundreds of designers, engineers, product managers, and
          founders. After episode 256, Bryn retired and I enlisted the help of
          my good friend{' '}
          <a
            href="https://twitter.com/marshallbock"
            target="_blank"
            rel="noopener noreferrer"
          >
            Marshall Bock
          </a>{' '}
          to co-host and explore a new format for the show. The podcast has been
          downloaded more than 5,000,000 times from designers all around the
          world. Today we record weekly shows talking about the latest indsutry
          news, answering listener questions, interviewing people doing
          interesting work, and sharing cool things that we find interesting.
        </Paragraph>

        <Paragraph>
          In 2015, as the Design Details Podcast was ramping up, Bryn and I
          teamed up with{' '}
          <a
            href="https://twitter.com/jcutrell"
            target="_blank"
            rel="noopener noreferrer"
          >
            Jonathan Cutrell
          </a>
          , the host of{' '}
          <a
            href="https://spec.fm/podcasts/developer-tea"
            target="_blank"
            rel="noopener noreferrer"
          >
            Developer Tea
          </a>
          , to create the{' '}
          <a href="https://spec.fm" target="_blank" rel="noopener noreferrer">
            Spec Network
          </a>
          . Spec is a podcast network for designers and developers. We host more
          than 10 shows on the network, and our shows have been downloaded more
          than 25 million times. Spec has paid out hundreds of thousands of
          dollars to show hosts since 2015.
        </Paragraph>

        <Paragraph>
          In the winter of 2019, fueled by a fascination of online privacy and
          security, I created{' '}
          <a
            href="https://securitycheckli.st"
            target="_blank"
            rel="noopener noreferrer"
          >
            Security Checklist
          </a>
          . This small app was my first solo{' '}
          <a
            href="https://github.com/brianlovin/security-checklist"
            target="_blank"
            rel="noopener noreferrer"
          >
            open-source project
          </a>
          , aimed at helping individuals improve their online security and
          protect their data from the endless barrage of data-hungry
          corporations on the internet. Security Checklist has received
          contributions from dozens of people and the site has reached hundreds
          of thousands of people online.
        </Paragraph>

        <div style={{ padding: '16px' }} />

        <Heading>How can I help?</Heading>

        <div style={{ padding: '8px' }} />

        <Paragraph>
          I love helping designers, engineers, and founders in any way I can. I
          like to do this in two ways:
        </Paragraph>

        <Paragraph>
          1. My{' '}
          <a
            href="https://twitter.com/brian_lovin"
            target="_blank"
            rel="noopener noreferrer"
          >
            Twitter DMs
          </a>{' '}
          are open. Let me know how I can help, ideally with specific questions
          or problems you're working through. I can be helpful in thinking about
          job interviews, portfolio presentations, tactical design work, working
          at startups vs. large companies, being a developer/designer hybrid,
          working in the open source community, building side projects, and
          podcasting. If I don't reply right away, please follow up – sometimes
          things slip through the cracks! But I'll do my best to reply quickly.
        </Paragraph>

        <Paragraph>
          2. If you find yourself in Manhattan, I'd love to meet you for coffee.
          I like to do this on Wednesday afternoons each week, for about an
          hour. Just shoot me an email or DM on Twitter and we can find a time.
          This hour will be most productive if there are specific questions or
          problems you’d like to talk about. Of course, I won't always have
          answers, but I think I can be a helpful listener and bounce questions
          back at you to hopefully provide logical next steps to pursue. If
          you’d rather just meet and chat casually, that’s fine too!
        </Paragraph>
      </SectionHeading>
    </Page>
  );
}
