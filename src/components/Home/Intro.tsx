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
      className="flex items-center space-x-3 group lg:text-base text-xs"
    >
      <strong className="w-fit-content lg:flex-none flex-grow font-medium text-gray-1000 group-hover:text-blue-600 group-hover:underline dark:text-gray-100 dark:group-hover:text-blue-500">
        {title}
      </strong>
      <span className="w-full border-t border-gray-300 border-dashed shrink dark:border-gray-800"/>
      {subtitle && <span className="lg:flex-none flex-1 text-tertiary">{subtitle}</span>}
      {date && (
        <span className="flex-none font-mono text-quaternary">{date}</span>
      )}
    </a>
  )
}

function SectionContainer(props) {
  return (
    <div
      className="grid items-start grid-cols-1 gap-6 md:grid-cols-12 w-full"
      {...props}
    />
  )
}

const workHistory = [
  {
    href: 'https://campsite.co',
    title: 'Campsite',
    subtitle: 'CEO',
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
    href: 'https://fullstackwhatever.com/episode/brian-lovin-ryan-nystrom-surrounded-by-people-doing-interesting-work',
    title: 'Full Stack Whatever with Ryan Nystrom',
    date: "Dec '23",
  },
  {
    href: 'https://www.youtube.com/watch?v=ozU063JY4ko&t=2s',
    title: 'Deep Dive: How to level up as an IC designer',
    date: "Nov '23",
  },
  {
    href: 'https://www.youtube.com/watch?v=njO9OJTDSGM&t=19s',
    title: 'Deep Dive: Lessons from Campsite',
    date: "Nov '23",
  },
  {
    href: 'https://open.spotify.com/episode/5rR19EwPx7wKevfaitnrZL?si=74837d42237240bd',
    title: 'Keshav Podcast: Design, Engineering, and Starting a Company',
    date: "Aug '23",
  },
  {
    href: 'https://fullstackwhatever.com/episode/brian-lovin-its-all-about-having-fun',
    title: 'Full Stack Whatever',
    date: "Jan '23",
  },
  {
    href: 'https://artofproductpodcast.com/episode-202',
    title: 'The Art of Product: The Art and Pain of Design',
    date: "Mar '22",
  },
  {
    href: 'https://museapp.com/podcast/51-personal-brand/',
    title: 'Metamuse: Personal Brand',
    date: "Mar '22",
  },
  {
    href: 'https://maze.co/podcast/#brian-lovin',
    title: 'Optimal Path: The Spectrum of Design',
    date: "Jan '22",
  },
  {
    href: 'https://uibreakfast.com/228-design-advisory-with-brian-lovin/',
    title: 'UI Breakfast: Design Advising',
    date: "Dec '21",
  },
  {
    href: 'https://designmba.show/episodes/brian-lovin',
    title: 'Design MBA: Managing Side Projects',
    date: "Nov '21",
  },
  {
    href: 'https://progressionapp.com/blog/podcast-26-brian-lovin-github-spectrum-design-details-on-the-rise-of-the-senior-ic/',
    title: 'Progression Podcast: The Rise of the Senior IC',
    date: "Jun '21",
  },
  {
    href: 'https://layout.fm/episodes/194/',
    title: 'Layout.fm',
    date: "Jan '21",
  },
  {
    href: "https://softwareengineeringdaily.com/'20/07/15/github-mobile-with-brian-lovin-and-ryan-nystrom/",
    title: 'Software Engineering Daily: GitHub Mobile',
    date: "Jul '20",
  },
  {
    href: 'https://www.swiftbysundell.com/podcast/67/',
    title: 'Swift by Sundell: Building for Open Source',
    date: "Feb '20",
  },
  {
    href: 'https://www.youtube.com/watch?v=SyS3h3kmBnY',
    title: 'Figma Config: Extend What’s Possible with Plugins',
    date: "Feb '20",
  },
  {
    href: 'https://www.loversmagazine.com/interviews/brian-lovin',
    title: 'Lovers Magazine',
    date: "Jan '18",
  },
  {
    href: 'https://www.youtube.com/watch?v=6MBBTdu8v6E',
    title: 'GraphQL Summit: Designing with GraphQL',
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
                    writer
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
                    href="https://campsite.co"
                    className="!text-orange-500"
                  >
                    Campsite
                  </a>
                  , an app that brings together a team’s posts, calls, notes,
                  and chat.
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
                </p>
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
