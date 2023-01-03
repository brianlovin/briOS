import Link from 'next/link'
import React from 'react'

import { Detail } from '~/components/ListDetail/Detail'
import { TitleBar } from '~/components/ListDetail/TitleBar'
import routes from '~/config/routes'
import { baseEmail } from '~/config/seo'

import Button, { PrimaryButton } from '../Button'
import { Testimonial } from './Testimonial'

const testimonials = [
  {
    avatarSrc: '/static/img/crit/tmcw.jpg',
    name: 'Tom MacWright',
    quoteSrc: 'https://twitter.com/tmcw/status/1487905310761263109',
    productSrc: 'https://placemark.io',
    productName: 'Placemark',
    productLogo: '/static/img/crit/placemark.jpg',
    reportSrc:
      'https://brianlovin.notion.site/Crit-Placemark-ebe780d4707f436b9663f5f296d1bfc7',
    youtube: 'https://www.youtube.com/embed/reWeNx9KA_E',
    quote:
      'Designing Placemark has often felt like wandering through a dungeon, this design crit process felt like someone popping up and showing me the dungeon map and showing me a whole bunch of secret shortcuts.',
  },
  {
    avatarSrc: '/static/img/crit/jmduke.jpg',
    name: 'Justin M. Duke',
    quoteSrc: 'https://twitter.com/jmduke/status/1488376005827842049',
    productSrc: 'https://buttondown.email',
    productName: 'Buttondown',
    productLogo: '/static/img/crit/buttondown.jpg',
    reportSrc:
      'https://brianlovin.notion.site/Crit-Buttondown-e9f46bd7995c4d53ae0dd2eb2ff86fab',
    youtube: 'https://www.youtube.com/embed/PxufnL7shIc',
    quote:
      'I was lucky enough to get Brian to take a look at Buttondown and, uh, holy smokes — that was the best money I’ve poured into the business in a long, long time. Trust me: book some time with him. Easiest investment you can make in your product',
  },
  {
    avatarSrc: '/static/img/crit/jeff_weinstein.jpg',
    name: 'Jeff Weinstein',
    quoteSrc: 'https://twitter.com/jeff_weinstein/status/1490918876112392196',
    productSrc: 'https://stripe.com/atlas',
    productName: 'Stripe Atlas',
    productLogo: '/static/img/crit/stripe.jpg',
    reportSrc: null,
    youtube: null,
    quote:
      'Brian’s critiques are a balanced alchemy of macro and micro. He identifies the few, most important things to structurally improve the user experience as well as a litany dump of smaller, straightforward changes to brighten fit and finish.',
  },
  {
    avatarSrc: '/static/img/crit/meredithneyrand.jpeg',
    name: 'Meredith Neyrand',
    quoteSrc: 'https://twitter.com/MeredithNeyrand/status/1493343761337753600',
    productSrc: 'https://stripe.com/payments/payment-links',
    productName: 'Stripe Payment Links',
    productLogo: '/static/img/crit/stripe.jpg',
    reportSrc: null,
    youtube: null,
    quote:
      'Money well spent! Thanks for the super detailed write-up and feedback on the Payment Links experience @brian_lovin. Incredibly valuable to get an unbiased outside opinion like that.',
  },
  {
    avatarSrc: '/static/img/crit/tommoor.png',
    name: 'Tom Moor',
    quoteSrc: 'https://twitter.com/tommoor/status/1492653348230627332?s=21',
    productSrc: 'https://getoutline.com',
    productName: 'Outline',
    productLogo: '/static/img/crit/outline.png',
    reportSrc:
      'https://brianlovin.notion.site/Outline-3947b9c3b5ff44a38af8e6146e6eb0fa',
    youtube: 'https://www.youtube.com/embed/UjG4lB2u-r4',
    quote:
      'We’ve all been stewing in our own designs for toooo long, a professional second set of eyes is a blessing 🙏',
  },
  {
    avatarSrc: '/static/img/crit/tylermking.jpeg',
    name: 'Tyler King',
    quoteSrc: 'https://twitter.com/TylerMKing',
    productSrc: 'https://lessannoyingcrm.com',
    productName: 'Less Annoying CRM',
    productLogo: '/static/img/crit/lacrm.png',
    reportSrc: 'https://www.youtube.com/watch?v=x9KMAudQBjE',
    youtube: 'https://www.youtube.com/embed/x9KMAudQBjE',
    quote:
      'Brian’s Crit was like a cheat code. We’re a small company without much design expertise, but with just a few pointers here and there from Brian, our design has been elevated to a new level of polish and profesionalism. He also taught me quite a bit throughout the process so that I can maintain this higher standard in the future.',
  },
  {
    avatarSrc: '/static/img/crit/kitze.jpg',
    name: 'Kitze',
    quoteSrc: 'https://twitter.com/thekitze',
    productSrc: 'https://sizzy.co',
    productName: 'Sizzy',
    productLogo: '/static/img/crit/sizzy.jpeg',
    reportSrc: 'https://www.youtube.com/watch?v=WggOnKLnFe4',
    youtube: 'https://www.youtube.com/embed/WggOnKLnFe4',
    quote:
      'After 2 years of randomly cramming buttons in random places, Brian’s super clean redesign felt like a breath of fresh air. Can’t wait to implement the changes!',
  },
]

export function Crit() {
  const scrollContainerRef = React.useRef(null)
  const titleRef = React.useRef(null)
  const stripePaymentUrl = 'https://buy.stripe.com/14keVCgDw4fN2KAeUX'

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
              See past health reports:{' '}
              <a
                href="https://brianlovin.notion.site/Crit-Placemark-ebe780d4707f436b9663f5f296d1bfc7"
                target="_blank"
                rel="noopener noreferrer"
              >
                Placemark
              </a>{' '}
              <span className="text-gray-300 dark:text-gray-800">/</span>{' '}
              <a
                href="https://brianlovin.notion.site/Crit-Buttondown-e9f46bd7995c4d53ae0dd2eb2ff86fab"
                target="_blank"
                rel="noopener noreferrer"
              >
                Buttondown
              </a>{' '}
              <span className="text-gray-300 dark:text-gray-800">/</span>{' '}
              <a
                href="https://brianlovin.notion.site/Outline-3947b9c3b5ff44a38af8e6146e6eb0fa"
                target="_blank"
                rel="noopener noreferrer"
              >
                Outline
              </a>{' '}
              <span className="text-gray-300 dark:text-gray-800">/</span>{' '}
              <a
                href="https://www.youtube.com/watch?v=x9KMAudQBjE"
                target="_blank"
                rel="noopener noreferrer"
              >
                Less Annoying CRM
              </a>
              .
            </p>
          </div>

          <div className="inline-flex space-x-3">
            <PrimaryButton size="large" href={stripePaymentUrl}>
              Get started
            </PrimaryButton>

            <Button
              size="large"
              href={`mailto:${baseEmail}?subject=Product design health report`}
            >
              Email me
            </Button>
          </div>

          <div className="w-16 h-px rounded bg-gray-150 dark:bg-gray-800" />

          <div className="space-y-6">
            {testimonials.map((testimonial) => (
              <Testimonial
                key={testimonial.reportSrc}
                testimonial={testimonial}
              />
            ))}
          </div>

          <div className="w-16 h-px rounded bg-gray-150 dark:bg-gray-800" />

          <p className="text-2xl font-bold text-primary">FAQ</p>

          <div className="prose prose-lg">
            <h5>Who are you?</h5>
            <p>
              Hey! I'm Brian, I'm a product designer at GitHub, startup founder,
              and side-project tinkerer. You can learn more about me{' '}
              <Link href="/">here</Link>
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
              $5,000 for a product teardown, which includes a user experience,
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
          <div className="inline-flex pb-32 space-x-3">
            <PrimaryButton size="large" href={stripePaymentUrl}>
              Get started
            </PrimaryButton>

            <Button
              size="large"
              href={`mailto:${baseEmail}?subject=Product design health report`}
            >
              Email me
            </Button>
          </div>
        </div>
      </Detail.ContentContainer>
    </Detail.Container>
  )
}
