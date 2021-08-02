import * as React from 'react'
import Image from 'next/image'
import Page from '~/components/Page'
import { CenteredColumn } from '~/components/Layouts'
import { NextSeo } from 'next-seo'
import routes from '~/config/routes'
import WritingSubscribeBox from '~/components/Writing/Subscribe'
import Link from 'next/link'

function About() {
  return (
    <Page>
      <NextSeo
        title={routes.about.seo.title}
        description={routes.about.seo.description}
        openGraph={routes.about.seo.openGraph}
      />

      <CenteredColumn>
        <div className="space-y-12 " data-cy="about-page">
          <div className="-mx-4 -mt-16 md:mt-0 md:-mx-8 ">
            <Image
              src="/static/img/about.jpg"
              alt={'A photo of me'}
              layout="responsive"
              width="672"
              height="448"
              className="md:rounded-lg"
            />
          </div>
          <div className="space-y-12 ">
            <div className="leading-relaxed prose ">
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
                Before GitHub, I co-founded{' '}
                <a href="https://spectrum.chat">Spectrum</a>, a platform for
                large-scale communities to have better public conversations.
                Spectrum was acquired by GitHub in November, 2018.
              </p>
              <p>
                Before Spectrum I designed payments experiences at Facebook,
                working across Facebook, Messenger, WhatsApp, and Instagram. I
                originally cut my teeth as the first product designer at{' '}
                <a href="https://buffer.com">Buffer</a>.
              </p>
              <p>
                I also co-host the{' '}
                <a href="https://designdetails.fm">Design Details Podcast</a>, a
                weekly conversation about design process and culture. Design
                Details is part of <a href="https://spec.fm">Spec.fm</a>, a
                podcast network for designers and developers, which I co-founded
                in 2015.
              </p>
              <p>
                You can find me on{' '}
                <a href="https://twitter.com/brian_lovin">Twitter</a> where I
                talk about design and development, or on{' '}
                <a href="https://github.com/brianlovin">GitHub</a> where I’m
                building in the open, or on{' '}
                <a href="https://figma.com/@brian">Figma</a> where I’m exploring
                how plugins can automate the tedious parts of interface design.
              </p>
              <p>
                Photo by <a href="https://twitter.com/rxnjmmt">@rxnjmmt</a>.
              </p>
            </div>
          </div>

          <WritingSubscribeBox />

          <div className="space-y-6">
            <h4 className="font-list-heading">Speaking and interviews</h4>
            <div className="space-y-6">
              <div className="space-y-1">
                <a
                  className="font-medium highlight-link-hover"
                  href="https://progressionapp.com/blog/podcast-26-brian-lovin-github-spectrum-design-details-on-the-rise-of-the-senior-ic/"
                >
                  Progression: The rise of the senior IC
                </a>

                <p className="text-tertiary">
                  I caught up with Jonny from Progression to talk about the rise
                  of the senior IC, career development for designers, building
                  and exiting a startup, the importance of job titles, and a
                  whole lot more.
                </p>
              </div>
              <div className="space-y-1">
                <a
                  className="font-medium highlight-link-hover"
                  href="https://layout.fm/episodes/194/"
                >
                  Layout.fm: It Ran Into the Wall of Reality
                </a>

                <p className="text-tertiary">
                  I spoke with Kevin and Rafa about the Staff Design project,
                  career ladders, imposter syndrome, and Paul Rudd.
                </p>
              </div>
              <div className="space-y-1">
                <a
                  className="font-medium highlight-link-hover"
                  href="https://www.swiftbysundell.com/podcast/67/"
                >
                  Building for open source
                </a>

                <p className="text-tertiary">
                  Ryan Nystrom and I talk about designing and building the
                  mobile apps at GitHub.
                </p>
              </div>

              <div className="space-y-1">
                <a
                  className="font-medium highlight-link-hover"
                  href="https://www.youtube.com/watch?v=SyS3h3kmBnY"
                >
                  Extend what’s possible with Figma Plugins - Figma Config
                </a>

                <p className="text-tertiary">
                  An exploration into the plugins I built to automate the
                  tedious parts of designing mobile apps at GitHub.
                </p>
              </div>

              <div className="space-y-1">
                <a
                  className="font-medium highlight-link-hover"
                  href="https://www.youtube.com/watch?v=6MBBTdu8v6E"
                >
                  Designing with GraphQL - GraphQL Summit
                </a>

                <p className="text-tertiary">
                  Exploring the possibilities that open up when designers and
                  developers can speak the same language.
                </p>
              </div>

              <div className="space-y-1">
                <a
                  className="font-medium highlight-link-hover"
                  href="https://interfacelovers.com/interviews/brian-lovin"
                >
                  Interface Lovers Interview
                </a>

                <p className="text-tertiary">
                  An interview about how I got into design, my process, and past
                  work.
                </p>
              </div>

              <div className="space-y-1">
                <a
                  className="font-medium highlight-link-hover"
                  href="https://spec.fm/podcasts/design-details/79352"
                >
                  Charmander++ – Interviewing ourselves on Design Details
                </a>

                <p className="text-tertiary">
                  Bryn Jackson and I interviewed each other. Totally humble.
                </p>
              </div>

              <div className="space-y-1">
                <a
                  className="font-medium highlight-link-hover"
                  href="https://avocode.com/blog/brian-lovin-product-designer-github-interview"
                >
                  Avocode Interview
                </a>

                <p className="text-tertiary">
                  An interview where we dig into my work at Buffer, Facebook,
                  Spectrum, and what’s in the works at GitHub.
                </p>
              </div>

              <div className="space-y-1">
                <a
                  className="font-medium highlight-link-hover"
                  href="https://softwareengineeringdaily.com/2020/07/15/github-mobile-with-brian-lovin-and-ryan-nystrom/"
                >
                  Software Engineering Daily: GitHub Mobile
                </a>

                <p className="text-tertiary">
                  Ryan and I discuss how we designed and built the first version
                  of GitHub’s mobile apps.
                </p>
              </div>
            </div>
          </div>
        </div>
      </CenteredColumn>
    </Page>
  )
}

export default About
