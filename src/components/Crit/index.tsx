import Link from 'next/link'
import React from 'react'

import { Detail } from '~/components/ListDetail/Detail'
import { TitleBar } from '~/components/ListDetail/TitleBar'
import routes from '~/config/routes'

import { PrimaryButton } from '../Button'

export function Crit() {
  const scrollContainerRef = React.useRef(null)
  const titleRef = React.useRef(null)

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
              Your design doesn’t feel quite right — it’s good, but not great.
              You know something is off, but you don't know where or why. You
              just want someone to tell you what needs a nudge.
            </p>
            <p>I can help.</p>
          </div>

          <div className="inline-block">
            <PrimaryButton
              size="large"
              href="https://buy.stripe.com/bIY8xe72Wh2z70Q3cc"
            >
              Let's fix things
            </PrimaryButton>
          </div>

          <div className="w-16 h-px rounded bg-gray-150 dark:bg-gray-800" />

          <p className="text-xl font-bold text-primary">FAQ</p>

          <div className="prose prose-lg">
            <h5>Who do you think you are?</h5>
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
            <h5>What is this?</h5>
            <p>
              I'm going to spend two hours doing the most thorough, over-the-top
              visual nitpicking you've ever seen. Show me your product, app, or
              website, and I'll point out in excruciating detail every pixel
              that I think could be better placed. I’ll point out the
              small-but-subtle ways alignment, color, and typographic choices
              are holding your design back from visual excellence. It'll be a
              blast!
            </p>
            <h5>Why do I need this?</h5>
            <p>
              Fair question! Sometimes people think of high quality visual
              design as "polish work" or a "nice to have stretch goal." But I
              believe that all software should be beautiful, and that form and
              function both play an important role in a product's success.
            </p>
            <p>A visual design critique will be most useful when:</p>
            <ul>
              <li>
                Your product is about to ship, and you need a last minute gut
                check to make things look perfect.
              </li>
              <li>
                Your product has grown weeds, and isn’t quite as consistent or
                shiny as it used to be. You need someone to point out where to
                start fixing things, and how to have the most impact with the
                least amount of effort.
              </li>
              <li>
                You want to understand why your designs look good in Figma, but
                aren't translating well into production code.
              </li>
            </ul>
            <h5>How much does it cost?</h5>
            <p>
              $1,000 for two hours of critique. This time can be split up as
              needed, or worked all at once. We can do things asynchronously or
              real-time on a video call.
            </p>
            <h5>That’s expensive!</h5>
            <p>So is bad design!</p>
            <p>
              I know that this price might not be realistic for many folks out
              there, or might not feel like it's paying for "enough." But my two
              hours with your interfaces will be highly productive, actionable,
              and easy to build against — more than a decade of design
              experience concentrated into two hours of value.
            </p>
            <h5>Only visual design?</h5>
            <p>
              It takes a long time for a designer to ramp up in a new business,
              industry, and problem space. For that kind of long-term
              commitment, it’s probably better to hire a contractor or full-time
              designer. But visual design critique can be done without as much
              context, meaning I can get in and get the work done quickly and
              efficiently.
            </p>
            <ul>
              <li>
                I won’t make up new features, remove features, or make
                consequential changes to your layout. If you think I'm your
                target customer, I will be happy to share more nuanced product
                feedback.
              </li>
              <li>
                I won’t propose logo, brand, or other costly thematic changes
                (like color schemes and typefaces). I might gently recommend
                small changes in these areas, but your brand is your brand. For
                this reason, your money will be best spent on in-product
                interfaces, not landing pages.
              </li>
              <li>
                I won’t implement any changes in code — I’m happy to pair with a
                frontend engineer of your choice to work through specific
                details if needed.
              </li>
            </ul>
            <h5>What’s the deliverable?</h5>
            <p>
              At the end of the two hours, I’ll send you notes of my findings
              with well-annotated screenshots and a Figma file full of
              high-fidelity recreations of your interfaces...but better!
            </p>
            <h5>What do you need from me?</h5>
            <p>
              Send me a list of views, pages, or flows that need the most
              attention. If it's more helpful for me to see a realistic
              interface that your users will experience, you can create a test
              account with pre-populated data that I'll work against. For
              anything more specific, we can always hop on a call to make sure I
              understand your goals and situation.
            </p>
            <h5>What if your work sucks?</h5>
            <p>
              A reasonable question, wise of you to ask. How about this: I
              guarantee that we'll find a meaningful way to improve the visual
              quality of your interfaces within two hours, or I'll send your
              money back without a fuss.
            </p>
            <h5>When can you start?</h5>
            <p>
              Click the blue button below, send over the cheddar, and I'll email
              you within 24 hours to get the process started. You should expect
              all the deliverables within a week or two, but keep in mind I'm
              only human!
            </p>
          </div>
          <div className="inline-flex flex-col pb-32 space-y-4">
            <PrimaryButton
              size="large"
              href="https://buy.stripe.com/bIY8xe72Wh2z70Q3cc"
            >
              Click this blue button
            </PrimaryButton>
            <p className="text-sm text-quaternary">
              * Current delivery estimate: 1-2 weeks
            </p>
          </div>
        </div>
      </Detail.ContentContainer>
    </Detail.Container>
  )
}
