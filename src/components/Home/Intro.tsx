import Image from 'next/image'
import Link from 'next/link'
import * as React from 'react'
import { MapPin } from 'react-feather'

import Button from '~/components/Button'
import { Detail } from '~/components/ListDetail/Detail'
import { TitleBar } from '~/components/ListDetail/TitleBar'

function SectionTitle(props) {
  return (
    <h4
      className="col-span-2 pt-8 text-lg font-extrabold text-black dark:text-white md:pt-0 md:text-right md:text-base md:font-normal md:text-opacity-40"
      {...props}
    />
  )
}

function SectionContent(props) {
  return <div className="col-span-10" {...props} />
}

interface TableRowProps {
  href: string
  title: string
  date: string
  subtitle?: string
}

function TableRow({ href, title, subtitle, date }: TableRowProps) {
  return (
    <a
      target="_blank"
      rel="noopener noreferrer"
      href={href}
      className="flex items-center space-x-4 group"
    >
      <strong className="flex-none font-medium text-gray-1000 group-hover:text-blue-600 group-hover:underline dark:text-gray-100 dark:group-hover:text-blue-500">
        {title}
      </strong>
      <span className="w-full border-t border-gray-300 border-dashed shrink dark:border-gray-800" />
      {subtitle && <span className="flex-none text-tertiary">{subtitle}</span>}
      {date && (
        <span className="flex-none font-mono text-quaternary">{date}</span>
      )}
    </a>
  )
}

function SectionContainer(props) {
  return (
    <div
      className="grid items-start grid-cols-1 gap-6 md:grid-cols-12"
      {...props}
    />
  )
}

const workHistory = [
  {
    href: 'https://campsite.design',
    title: 'Campsite',
    subtitle: 'Founder',
    date: '2022—\u00a0\u00a0',
  },
  {
    href: 'https://github.com/mobile',
    title: 'GitHub',
    subtitle: 'Product Designer',
    date: '2018—22',
  },
  {
    href: 'https://designdetails.fm',
    title: 'Design Details Podcast',
    subtitle: 'Co-host',
    date: '2014—\u00a0\u00a0',
  },
  {
    href: 'https://github.com/withspectrum/spectrum',
    title: 'Spectrum.chat',
    subtitle: 'Co-founder',
    date: '2017—18',
  },
  {
    href: 'https://facebook.com',
    title: 'Facebook',
    subtitle: 'Product Designer',
    date: '2015—17',
  },
  {
    href: 'https://buffer.com',
    title: 'Buffer',
    subtitle: 'Product Designer',
    date: '2013—15',
  },
]

const speakingData = [
  {
    href: 'https://artofproductpodcast.com/episode-202',
    title: 'The Art of Product',
    date: "Mar '22",
  },
  {
    href: 'https://museapp.com/podcast/51-personal-brand/',
    title: 'Metamuse: Personal Brand',
    date: "Mar '22",
  },
  {
    href: 'https://maze.co/podcast/#brian-lovin',
    title: 'The Optimal Path Podcast',
    date: "Jan '22",
  },
  {
    href: 'https://uibreakfast.com/228-design-advisory-with-brian-lovin/',
    title: 'UI Breakfast',
    date: "Dec '21",
  },
  {
    href: 'https://designmba.show/episodes/brian-lovin',
    title: 'Design MBA',
    date: "Nov '21",
  },
  {
    href: 'https://progressionapp.com/blog/podcast-26-brian-lovin-github-spectrum-design-details-on-the-rise-of-the-senior-ic/',
    title: 'Progression Podcast',
    date: "Jun '21",
  },
  {
    href: 'https://layout.fm/episodes/194/',
    title: 'Layout.fm',
    date: "Jan '21",
  },
  {
    href: "https://softwareengineeringdaily.com/'20/07/15/github-mobile-with-brian-lovin-and-ryan-nystrom/",
    title: 'Software Engineering Daily',
    date: "Jul '20",
  },
  {
    href: 'https://avocode.com/blog/brian-lovin-product-designer-github-interview',
    title: 'The Grit',
    date: "Jul '20",
  },
  {
    href: 'https://www.swiftbysundell.com/podcast/67/',
    title: 'Swift by Sundell',
    date: "Feb '20",
  },
  {
    href: 'https://www.youtube.com/watch?v=SyS3h3kmBnY',
    title: 'Figma Config',
    date: "Feb '20",
  },
  {
    href: 'https://www.loversmagazine.com/interviews/brian-lovin',
    title: 'Lovers Magazine',
    date: "Jan '18",
  },
  {
    href: 'https://www.youtube.com/watch?v=6MBBTdu8v6E',
    title: 'GraphQL Summit',
    date: "Nov '17",
  },
  {
    href: 'https://designdetails.fm/episodes/3e342ac0',
    title: 'Design Details',
    date: "Aug '17",
  },
]

export function Intro() {
  const scrollContainerRef = React.useRef(null)
  const titleRef = React.useRef(null)

  return (
    <Detail.Container data-cy="home-intro" ref={scrollContainerRef}>
      <TitleBar
        magicTitle
        titleRef={titleRef}
        scrollContainerRef={scrollContainerRef}
        title="Home"
      />

      {/* Keep this div to trigger the magic scroll */}
      <div className="p-4" ref={titleRef} />

      <Detail.ContentContainer>
        <div className="pb-24 space-y-8 md:space-y-16">
          <SectionContainer>
            <SectionTitle />
            <SectionContent>
              <div className="prose text-primary">
                <p>
                  Hey, I&apos;m Brian. I&apos;m a designer,{' '}
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href="https://designdetails.fm"
                  >
                    podcaster
                  </a>
                  ,{' '}
                  <Link href="/writing" passHref>
                    <a>writer</a>
                  </Link>
                  , and{' '}
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href="https://github.com/brianlovin"
                  >
                    software tinkerer
                  </a>
                  . I&apos;m currently building{' '}
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href="https://campsite.design"
                  >
                    Campsite
                  </a>
                  , a tool that helps software share and discover
                  work-in-progress.
                </p>

                <p>
                  Before Campsite, I spent four years designing{' '}
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href="https://github.com/mobile"
                  >
                    native mobile apps at GitHub
                  </a>
                  .
                </p>
                <p>
                  Before GitHub, I co-founded{' '}
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href="https://spectrum.chat"
                  >
                    Spectrum
                  </a>
                  , a platform for large-scale communities to have better public
                  conversations. Spectrum was acquired by GitHub in November,
                  2018.
                </p>
                <p>
                  Before Spectrum I designed payments experiences at Facebook,
                  working across Facebook, Messenger, WhatsApp, and Instagram. I
                  originally cut my teeth as the first product designer at{' '}
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href="https://buffer.com"
                  >
                    Buffer
                  </a>
                  .
                </p>
                <p>
                  I also co-host the{' '}
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href="https://designdetails.fm"
                  >
                    Design Details Podcast
                  </a>
                  , a weekly conversation about design process and culture.
                  Design Details is part of{' '}
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href="https://spec.fm"
                  >
                    Spec.fm
                  </a>
                  , a podcast network for designers and developers, which I
                  co-founded in 2015.
                </p>
              </div>
              <div className="flex pt-6">
                <Button href="https://changelog.brianlovin.com">
                  View changelog
                </Button>
              </div>
            </SectionContent>
          </SectionContainer>

          <SectionContainer>
            <SectionTitle>Online</SectionTitle>
            <SectionContent>
              <div className="flex flex-col space-y-3">
                <TableRow
                  href={'/twitter'}
                  title={'Twitter'}
                  subtitle={'Follow'}
                  date={''}
                />
                <TableRow
                  href={'/youtube'}
                  title={'YouTube'}
                  subtitle={'Subscribe'}
                  date={''}
                />
                <TableRow
                  href={'/github'}
                  title={'GitHub'}
                  subtitle={'Follow'}
                  date={''}
                />
                <TableRow
                  href={'/figma'}
                  title={'Figma'}
                  subtitle={'Follow'}
                  date={''}
                />
              </div>
            </SectionContent>
          </SectionContainer>

          <SectionContainer>
            <SectionTitle>Where</SectionTitle>
            <SectionContent>
              <Image
                priority
                src="/static/img/sf.png"
                width={800}
                height={400}
                layout="responsive"
                className="rounded-2xl"
                quality={100}
                alt="Map of San Francisco with blue location dot in the middle"
              />
              <p className="flex items-center justify-end pt-2 space-x-2 text-sm text-quaternary md:text-right">
                <MapPin size={12} />
                <span>San Francisco, CA</span>
              </p>
            </SectionContent>
          </SectionContainer>

          <SectionContainer>
            <SectionTitle>Work</SectionTitle>
            <SectionContent>
              <div className="flex flex-col space-y-3">
                {workHistory.map((job) => (
                  <TableRow
                    href={job.href}
                    title={job.title}
                    subtitle={job.subtitle}
                    date={job.date}
                    key={job.href}
                  />
                ))}
              </div>
            </SectionContent>
          </SectionContainer>

          <SectionContainer>
            <SectionTitle>Speaking</SectionTitle>
            <SectionContent>
              <div className="flex flex-col space-y-3">
                {speakingData.map((s) => (
                  <TableRow
                    href={s.href}
                    title={s.title}
                    date={s.date}
                    key={s.href}
                  />
                ))}
              </div>
            </SectionContent>
          </SectionContainer>
        </div>
      </Detail.ContentContainer>
    </Detail.Container>
  )
}
