import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

import { Detail } from '~/components/ListDetail/Detail'
import { TitleBar } from '~/components/ListDetail/TitleBar'
import routes from '~/config/routes'

import Button, { PrimaryButton } from '../Button'
import { ExternalLinkIcon } from '../Icon'
import { Testimonial } from './Testimonial'

const testimonials = [
  {
    avatarSrc: '/static/img/crit/tmcw.jpg',
    name: 'Tom MacWright',
    quoteSrc: 'https://twitter.com/tmcw/status/1487905310761263109',
    productSrc: 'https://placemark.io',
    productName: 'Placemark',
    reportSrc:
      'https://brianlovin.notion.site/Crit-Placemark-ebe780d4707f436b9663f5f296d1bfc7',
    quote:
      'Designing Placemark has often felt like wandering through a dungeon, this design crit process felt like someone popping up and showing me the dungeon map and showing me a whole bunch of secret shortcuts.',
  },
]

export function Crit() {
  const scrollContainerRef = React.useRef(null)
  const titleRef = React.useRef(null)
  const stripePaymentUrl = 'https://buy.stripe.com/00g28Q3QK8w3dpe7su'

  return (
    <Detail.Container ref={scrollContainerRef}>
      <TitleBar
        magicTitle
        title={'Crit'}
        titleRef={titleRef}
        scrollContainerRef={scrollContainerRef}
      />

      <Detail.ContentContainer>
        <Detail.Header>
          <Detail.Title ref={titleRef}>{routes.crit.seo.title}</Detail.Title>
          <p className="text-xl text-tertiary">{routes.crit.seo.description}</p>
        </Detail.Header>

        <div className="pt-12 space-y-12">
          <div className="w-16 h-px rounded bg-gray-150 dark:bg-gray-800" />
          <div className="prose prose-lg">
            <p>
              Crit is a comprehensive product design health report. It's a
              thorough usability, user interface, interaction, and visual design
              audit, and includes a redesign of a single page in your product
              with actionable suggestions for improvement.
            </p>
            <p>
              You‘ll receive an in-depth product teardown document, including my
              product recommendations, bug reports, visual nits, and a Figma
              file containing annotated screenshots and a redesign of a single
              screen.
            </p>
            <p>
              See the results of an example health report{' '}
              <a
                href="https://brianlovin.notion.site/Crit-Placemark-ebe780d4707f436b9663f5f296d1bfc7"
                target="_blank"
                rel="noopener noreferrer"
              >
                here
              </a>
              .
            </p>
          </div>

          <div className="inline-block">
            <PrimaryButton size="large" href={stripePaymentUrl}>
              Get started
            </PrimaryButton>
          </div>

          <div className="w-16 h-px rounded bg-gray-150 dark:bg-gray-800" />

          {testimonials.map((testimonial) => (
            <Testimonial
              key={testimonial.reportSrc}
              testimonial={testimonial}
            />
          ))}

          <div className="w-16 h-px rounded bg-gray-150 dark:bg-gray-800" />

          <p className="text-2xl font-bold text-primary">FAQ</p>

          <div className="prose prose-lg">
            <h5>Who are you?</h5>
            <p>
              Hey! I'm Brian, I'm a product designer at GitHub, startup founder,
              and side-project tinkerer. You can learn more about me{' '}
              <Link href="/">
                <a>here</a>
              </Link>
              {', '}
              or poke around the other pages on this site to get a feel for my
              work.
            </p>

            <h5>Why do I need this?</h5>
            <p>A product design health report will be most useful when:</p>
            <ul>
              <li>
                Your product is about to ship, and you need a gut check to make
                things look great and work well.
              </li>
              <li>
                Your product has grown weeds, and isn’t quite as consistent or
                shiny as it used to be. You need someone to point out where to
                start fixing things and how to have the most impact with a few
                key changes.
              </li>
              <li>
                You want to understand why your designs seem to work well in
                Figma, but don’t end up looking correct in production code.
              </li>
            </ul>

            <h5>How much does it cost?</h5>
            <p>
              $2,500 for a product teardown, which includes a user experience,
              user interface, visual, and interaction design audit, as well as a
              redesign of one view in your app.
            </p>

            <h5>Are you redesigning my whole product?</h5>
            <p>
              No. It takes a long time for a designer to ramp up in a new
              business, industry, and problem space. For that kind of long-term
              commitment, it’s probably better to hire a contractor or full-time
              designer. I will be spending my time evaluating the usability,
              interactions, interfaces, and workflows of your app, without
              requiring hours of your time to get me up to speed on the nuanced
              context of the product's entire footprint.
            </p>
            <ul>
              <li>
                I won’t make up new features, remove features, or make
                impossible-to-implement changes to your overall app structure. I
                might suggest ways for features to flow better, or solve the
                problem in a different way, but I won't pretend to understand
                everything about your business or customer.
              </li>
              <li>
                I won’t redesign your logo, brand, or make other costly thematic
                changes (like color schemes and typefaces). I might gently
                recommend small tweaks in these areas, but your brand is your
                brand.
              </li>
              <li>
                This health report does not include a full accessibility audit.
                I will point out accessibility concerns as I encounter them, but
                this critique should not be used in place of a professional
                accessibility audit.
              </li>
              <li>
                I am unable to redesign your entire icon system. If you are
                interested in having help redoing your icons, I am happy to
                connect you with some of the best icon designers in the industry
                to do this work.
              </li>
              <li>
                I won’t implement any changes in code. See an{' '}
                <a
                  href="https://brianlovin.notion.site/Crit-Placemark-ebe780d4707f436b9663f5f296d1bfc7"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  example health report
                </a>{' '}
                for a more clear expectation of what you’ll receive.
              </li>
            </ul>

            <h5>What do you need from me?</h5>
            <p>
              Send me a list of 1-3 views, pages, or flows that need the most
              attention. If it's more helpful for me to see a realistic
              interface that your users will experience, you can create a test
              account with pre-populated data that I'll work against. For
              anything more specific, we can always hop on a call to make sure I
              understand your goals and situation.
            </p>
            <p>
              I will also spend time redesigning a single page of your product —
              let me know which page I should use. It will save me time if you
              are able to provide your brand assets (logos, typefaces, colors,
              etc.), icon set, or other relevant documentation.
            </p>

            <h5>What's your refund policy?</h5>
            <p>
              I guarantee that we'll find a meaningful way to improve the design
              quality of your product, or I'll send your money back without a
              fuss.
            </p>

            <h5>When can you start?</h5>
            <p>
              Click the blue button below to send payment, and I'll email you
              within 24 hours to get the process started. You should expect the
              entire process to complete within two to four weeks.
            </p>
          </div>
          <div className="inline-flex flex-col pb-32 space-y-4">
            <PrimaryButton size="large" href={stripePaymentUrl}>
              Get started
            </PrimaryButton>
          </div>
        </div>
      </Detail.ContentContainer>
    </Detail.Container>
  )
}
